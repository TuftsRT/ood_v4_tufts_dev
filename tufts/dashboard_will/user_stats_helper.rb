# app/helpers/user_stats_helper.rb
require 'yaml'
require 'time'

module UserStatsHelper
  # Returns a hash of basic user stats based on session files
  def user_stats
    data_root = Pathname.new(OodAppkit.dataroot)
    sessions_path = data_root.join("sys/dashboard/batch_connect/sys")

    jobs = []

    Dir.glob(sessions_path.join("**/output/*/session.yml")).each do |session_file|
      begin
        session = YAML.load_file(session_file)
        jobs << {
          title: session["title"] || "Unknown App",
          cluster: session["cluster"] || "unknown",
          created_at: session["created_at"] ? Time.parse(session["created_at"].to_s) : nil,
          status: session["status"] || "unknown"
        }
      rescue => e
        Rails.logger.warn "Failed to parse #{session_file}: #{e.message}"
      end
    end

    total_jobs = jobs.count
    last_job = jobs.max_by { |j| j[:created_at] || Time.at(0) }
    last_login = last_job&.dig(:created_at)

    {
      total_jobs: total_jobs,
      last_login: last_login,
      active_jobs: jobs.count { |j| j[:status] == "running" },
      jobs_by_cluster: jobs.group_by { |j| j[:cluster] }.transform_values(&:count)
    }
  end
end
