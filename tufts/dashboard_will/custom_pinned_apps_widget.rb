# https://localhost:3443/pun/sys/dashboard/files/edit/fs/home/hpcadmin/ondemand/config/widgets/custom_pinned_apps_widget.rb

# frozen_string_literal: true

class CustomPinnedAppsWidget < OodAppkit::Widget
  title 'Pinned Apps'
  description 'Displays user-pinned apps with ability to customize.'

  def render
    # Safely get all pinned apps, filtering via sys/*
    all_apps = OodAppGroup.groups_for(OodApp.all).flat_map(&:apps)
    pinned_apps = all_apps.select { |app| app.category.start_with?('sys/') }

    context = {
      apps: pinned_apps,
      menu_length: ENV.fetch('OOD_PINNED_APPS_MENU_LENGTH', 4).to_i
    }

    render_template('custom_pinned_apps', context)
  end
end
