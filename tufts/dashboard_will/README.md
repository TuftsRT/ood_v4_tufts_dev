## Appendix

### A. Complete File Checklist

**New Files (16 total):**

- [ ] `app/controllers/concerns/user_stats_concern.rb`
- [ ] `app/controllers/concerns/custom_motd_concern.rb`
- [ ] `app/controllers/concerns/pinned_apps_selector_concern.rb`
- [ ] `app/controllers/pinned_apps_controller.rb`
- [ ] `app/views/widgets/_user_stats.html.erb`
- [ ] `app/views/widgets/_custom_motd.html.erb`
- [ ] `app/views/widgets/_pinned_apps_selector_modal.html.erb`
- [ ] `app/views/widgets/_motd.html.erb` (restored)
- [ ] `app/assets/stylesheets/user_stats.scss`
- [ ] `app/assets/stylesheets/custom_motd.scss`
- [ ] `app/assets/stylesheets/pinned_apps_selector.scss`
- [ ] `config/custom_motd.yml` (optional example)

**Modified Files (3 total):**

- [ ] `app/controllers/dashboard_controller.rb`
- [ ] `app/helpers/dashboard_helper.rb`
- [ ] `app/views/widgets/_pinned_apps.html.erb`
- [ ] `config/routes.rb`

### B. Directory Structure

```
dashboard/
├── app/
│   ├── assets/
│   │   └── stylesheets/
│   │       ├── user_stats.scss (NEW)
│   │       ├── custom_motd.scss (NEW)
│   │       └── pinned_apps_selector.scss (NEW)
│   ├── controllers/
│   │   ├── concerns/
│   │   │   ├── user_stats_concern.rb (NEW)
│   │   │   ├── custom_motd_concern.rb (NEW)
│   │   │   └── pinned_apps_selector_concern.rb (NEW)
│   │   ├── dashboard_controller.rb (MODIFIED)
│   │   └── pinned_apps_controller.rb (NEW)
│   ├── helpers/
│   │   └── dashboard_helper.rb (MODIFIED)
│   └── views/
│       └── widgets/
│           ├── _user_stats.html.erb (NEW)
│           ├── _custom_motd.html.erb (NEW)
│           ├── _pinned_apps_selector_modal.html.erb (NEW)
│           ├── _pinned_apps.html.erb (MODIFIED)
│           ├── _motd.html.erb (RESTORED)
│           └── pinned_apps/
│               ├── _app.html.erb (EXISTING)
│               ├── _app_content.html.erb (EXISTING)
│               └── _group.html.erb (EXISTING)
└── config/
    ├── routes.rb (MODIFIED)
    └── custom_motd.yml (NEW - Optional)
```

### C. Installation Script

Create this bash script for automated installation:

**File:** `install_dashboard_widgets.sh`

```bash
#!/bin/bash

# Dashboard Widgets Installation Script
# Usage: ./install_dashboard_widgets.sh /path/to/dashboard

set -e

DASHBOARD_ROOT="${1:-.}"
BACKUP_DIR="backups/dashboard_$(date +%Y%m%d_%H%M%S)"

echo "=== Dashboard Widgets Installation ==="
echo "Dashboard root: $DASHBOARD_ROOT"
echo ""

# Create backup
echo "Creating backup..."
mkdir -p "$BACKUP_DIR"
cp -r "$DASHBOARD_ROOT/app" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$DASHBOARD_ROOT/config" "$BACKUP_DIR/" 2>/dev/null || true
echo "Backup created at $BACKUP_DIR"
echo ""

# Create directories
echo "Creating directories..."
mkdir -p "$DASHBOARD_ROOT/app/controllers/concerns"
mkdir -p "$DASHBOARD_ROOT/app/views/widgets/pinned_apps"
mkdir -p "$DASHBOARD_ROOT/app/assets/stylesheets"
echo "Directories created"
echo ""

# Check for required files
echo "Checking for required source files..."
REQUIRED_FILES=(
  "user_stats_concern.rb"
  "custom_motd_concern.rb"
  "pinned_apps_selector_concern.rb"
  "pinned_apps_controller.rb"
  "_user_stats.html.erb"
  "_custom_motd.html.erb"
  "_pinned_apps_selector_modal.html.erb"
  "user_stats.scss"
  "custom_motd.scss"
  "pinned_apps_selector.scss"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "✗ Missing required file: $file"
    echo "Please ensure all required files are in the current directory."
    exit 1
  fi
done
echo "All required files found"
echo ""

# Copy files
echo "Copying files..."

# Concerns
cp user_stats_concern.rb "$DASHBOARD_ROOT/app/controllers/concerns/"
cp custom_motd_concern.rb "$DASHBOARD_ROOT/app/controllers/concerns/"
cp pinned_apps_selector_concern.rb "$DASHBOARD_ROOT/app/controllers/concerns/"
echo "Concerns copied"

# Controllers
cp pinned_apps_controller.rb "$DASHBOARD_ROOT/app/controllers/"
echo "Controllers copied"

# Views
cp _user_stats.html.erb "$DASHBOARD_ROOT/app/views/widgets/"
cp _custom_motd.html.erb "$DASHBOARD_ROOT/app/views/widgets/"
cp _pinned_apps_selector_modal.html.erb "$DASHBOARD_ROOT/app/views/widgets/"
echo "Views copied"

# Stylesheets
cp user_stats.scss "$DASHBOARD_ROOT/app/assets/stylesheets/"
cp custom_motd.scss "$DASHBOARD_ROOT/app/assets/stylesheets/"
cp pinned_apps_selector.scss "$DASHBOARD_ROOT/app/assets/stylesheets/"
echo "Stylesheets copied"

# Optional: Copy example MOTD
if [ -f "custom_motd.yml" ]; then
  cp custom_motd.yml "$DASHBOARD_ROOT/config/"
  echo "Example MOTD config copied"
fi

echo ""
echo "=== Installation Complete ==="
echo ""
echo "NEXT STEPS:"
echo "1. Update dashboard_controller.rb (see documentation)"
echo "2. Update dashboard_helper.rb (see documentation)"
echo "3. Update _pinned_apps.html.erb (see documentation)"
echo "4. Add route to config/routes.rb:"
echo "   post 'pinned_apps/save', to: 'pinned_apps#save', as: 'save_pinned_apps'"
echo "5. Restart dashboard:"
echo "   touch $DASHBOARD_ROOT/tmp/restart.txt"
echo ""
echo "Backup location: $BACKUP_DIR"
```

**Make executable and run:**

```bash
chmod +x install_dashboard_widgets.sh
./install_dashboard_widgets.sh /path/to/dashboard
```

### D. Rollback Procedure

If you need to revert changes:

```bash
#!/bin/bash

# Rollback script

DASHBOARD_ROOT="${1:-.}"
BACKUP_DIR="${2}"

if [ -z "$BACKUP_DIR" ] || [ ! -d "$BACKUP_DIR" ]; then
  echo "Usage: ./rollback.sh /path/to/dashboard /path/to/backup"
  exit 1
fi

echo "=== Rolling back dashboard ==="
echo "Dashboard root: $DASHBOARD_ROOT"
echo "Backup source: $BACKUP_DIR"
echo ""

read -p "Are you sure you want to rollback? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Rollback cancelled"
  exit 1
fi

# Restore files
cp -r "$BACKUP_DIR/app" "$DASHBOARD_ROOT/"
cp -r "$BACKUP_DIR/config" "$DASHBOARD_ROOT/"

echo "✓ Files restored"
echo ""
echo "Restarting dashboard..."
touch "$DASHBOARD_ROOT/tmp/restart.txt"
echo "✓ Restart triggered"
echo ""
echo "=== Rollback Complete ==="
```

### E. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-10 | Initial release |
| | | - User Stats Widget |
| | | - Custom MOTD Widget |
| | | - Pinned Apps Selector |

### F. Support and Contact

**Documentation Issues:**
- Check logs in `/var/log/ondemand-nginx/$USER/error.log`
- Review Rails logs in `log/production.log`
- Enable debug mode for verbose output

**Common Resources:**
- Open OnDemand Documentation: https://osc.github.io/ood-documentation/
- Ruby on Rails Guides: https://guides.rubyonrails.org/
- Bootstrap Documentation: https://getbootstrap.com/docs/

---

## Conclusion

This installation guide provides comprehensive instructions for implementing three custom widgets for Open OnDemand dashboards. Follow the steps carefully, test thoroughly, and refer to the troubleshooting section if issues arise.

**Key Takeaways:**

1. Always backup before making changes
2. Follow the file structure exactly
3. Test each widget independently
4. Monitor logs for errors
5. Use the rollback procedure if needed

**Post-Installation:**

- [ ] Verify all widgets appear on dashboard
- [ ] Test user interactions (clicks, searches, selections)
- [ ] Confirm data persistence across sessions
- [ ] Monitor performance and logs
- [ ] Document any custom configurations

Good luck with your installation!

```
// Edit button for pinned apps widget
.edit-pinned-apps-btn {
  margin-top: 15px;
  width: 100%;
  
  i {
    margin-right: 6px;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  #pinnedAppsModal {
    .modal-dialog {
      margin: 0.5rem;
      max-width: calc(100% - 1rem);
    }
    
    .modal-body {
      max-height: 60vh;
      padding: 15px;
    }
  }
  
  .app-select-item {
    padding: 0 5px;
    margin-bottom: 15px;
  }
  
  .app-select-icon {
    width: 60px;
    height: 60px;
  }
  
  .app-select-title {
    font-size: 13px;
    min-height: 32px;
  }
}

@media (max-width: 576px) {
  .app-select-item {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

// Animation for modal entrance
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#pinnedAppsModal.show .modal-dialog {
  animation: modalSlideIn 0.3s ease-out;
}
```

#### 3.4 Update Pinned Apps Widget

**File:** `app/views/widgets/_pinned_apps.html.erb`

**Purpose:** Updated widget view to include "Edit Pinned Apps" button and modal.

**Changes Made:**

```diff
- <%- if pinned_apps? -%>
-   <h2><%= t('dashboard.pinned_apps_title') %> <small><%= t('dashboard.pinned_apps_caption_html', all_apps_url: apps_index_path) %></small></h2>
+ <div class="pinned-apps-section">
+   <h2>
+     <%= t('dashboard.pinned_apps_title', default: 'Pinned Apps') %> 
+     <small><%= t('dashboard.pinned_apps_caption_html', all_apps_url: apps_index_path, default: '') %></small>
+     <button 
+       class="btn btn-sm btn-outline-primary float-end" 
+       onclick="openPinnedAppsSelector()"
+       title="Edit pinned applications">
+       <i class="fa fa-edit"></i> Edit Pinned Apps
+     </button>
+   </h2>

-   <%- if @user_configuration.pinned_apps_group_by.present? -%>
+   <%- if @pinned_apps.present? -%>
+     <%- if @user_configuration.pinned_apps_group_by.present? -%>
        <%= render(partial: "/widgets/pinned_apps/group", collection: OodAppGroup.groups_for(apps: @pinned_apps, group_by: @user_configuration.pinned_apps_group_by.to_sym))  %>
-   <%- else -%>
+     <%- else -%>
        <div class="row">
          <%= render partial: "/widgets/pinned_apps/app", collection: @pinned_apps %>
        </div>
+     <%- end -%>
+   <%- else -%>
+     <div class="alert alert-info text-center">
+       <i class="fa fa-info-circle"></i>
+       <p class="mb-2"><strong>Welcome!</strong> Select your favorite applications to pin them to your dashboard.</p>
+       <button 
+         class="btn btn-primary" 
+         onclick="openPinnedAppsSelector()">
+         <i class="fa fa-thumbtack"></i> Select Pinned Apps
+       </button>
+     </div>
    <%- end -%>
- <%- end -%>
+ </div>
+ 
+ <!-- Include the selector modal -->
+ <%= render partial: 'widgets/pinned_apps_selector_modal' %>
```

**Full Updated Content:**

```erb
<div class="pinned-apps-section">
  <h2>
    <%= t('dashboard.pinned_apps_title', default: 'Pinned Apps') %> 
    <small><%= t('dashboard.pinned_apps_caption_html', all_apps_url: apps_index_path, default: '') %></small>
    <button 
      class="btn btn-sm btn-outline-primary float-end" 
      onclick="openPinnedAppsSelector()"
      title="Edit pinned applications">
      <i class="fa fa-edit"></i> Edit Pinned Apps
    </button>
  </h2>

  <%- if @pinned_apps.present? -%>
    <%- if @user_configuration.pinned_apps_group_by.present? -%>
      <%= render(partial: "/widgets/pinned_apps/group", collection: OodAppGroup.groups_for(apps: @pinned_apps, group_by: @user_configuration.pinned_apps_group_by.to_sym))  %>
    <%- else -%>
      <div class="row">
        <%= render partial: "/widgets/pinned_apps/app", collection: @pinned_apps %>
      </div>
    <%- end -%>
  <%- else -%>
    <div class="alert alert-info text-center">
      <i class="fa fa-info-circle"></i>
      <p class="mb-2"><strong>Welcome!</strong> Select your favorite applications to pin them to your dashboard.</p>
      <button 
        class="btn btn-primary" 
        onclick="openPinnedAppsSelector()">
        <i class="fa fa-thumbtack"></i> Select Pinned Apps
      </button>
    </div>
  <%- end -%>
</div>

<!-- Include the selector modal -->
<%= render partial: 'widgets/pinned_apps_selector_modal' %>
```

#### 3.5 Create Pinned Apps Controller

**File:** `app/controllers/pinned_apps_controller.rb`

**Purpose:** API endpoint for saving user's pinned app selections to session.

**Full Content:**

```ruby
# Controller for saving user's pinned app preferences
class PinnedAppsController < ApplicationController
  # POST /pinned_apps/save
  def save
    pinned_app_ids = params[:pinned_app_ids] || []
    
    # Validate that pinned_app_ids is an array
    unless pinned_app_ids.is_a?(Array)
      render json: { error: 'Invalid data format' }, status: :bad_request
      return
    end
    
    # Save to session
    session[:pinned_app_ids] = pinned_app_ids
    
    render json: { 
      success: true, 
      message: 'Pinned apps saved successfully',
      count: pinned_app_ids.length
    }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Error saving pinned apps: #{e.message}"
    render json: { error: 'Failed to save pinned apps' }, status: :internal_server_error
  end
end
```

**API Specification:**

**Request:**
```http
POST /pinned_apps/save
Content-Type: application/json
X-CSRF-Token: <token>

{
  "pinned_app_ids": ["app_id_1", "app_id_2", "app_id_3"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Pinned apps saved successfully",
  "count": 3
}
```

**Response (Error):**
```json
{
  "error": "Invalid data format"
}
```

#### 3.6 Restore Original MOTD Widget

**File:** `app/views/widgets/_motd.html.erb`

**Purpose:** Simple wrapper to maintain compatibility with original MOTD system.

**Full Content:**

```erb
<%= render @motd if @motd %>
```

---

### 4. Modified Files

#### 4.1 Update Dashboard Controller

**File:** `app/controllers/dashboard_controller.rb`

**Changes Made:**

```diff
  # The controller for dashboard (root) pages /dashboard
  class DashboardController < ApplicationController
    include MotdConcern
+   include UserStatsConcern
+   include CustomMotdConcern
+   include PinnedAppsSelectorConcern
    
    def index
      begin
-       set_motd
+       set_motd if respond_to?(:set_motd, true)
      rescue StandardError => e
        flash.now[:alert] = t('dashboard.motd_erb_render_error', error_message: e.message)
      end
      set_my_quotas
    end

    def logout
    end
  end
```

**Full Updated Content:**

```ruby
# The controller for dashboard (root) pages /dashboard
class DashboardController < ApplicationController
  include MotdConcern
  include UserStatsConcern
  include CustomMotdConcern
  include PinnedAppsSelectorConcern
  
  def index
    begin
      set_motd if respond_to?(:set_motd, true)
    rescue StandardError => e
      flash.now[:alert] = t('dashboard.motd_erb_render_error', error_message: e.message)
    end
    set_my_quotas
  end

  def logout
  end
end
```

**Explanation of Changes:**

| Change | Reason |
|--------|--------|
| `include UserStatsConcern` | Adds user statistics functionality |
| `include CustomMotdConcern` | Adds custom MOTD functionality |
| `include PinnedAppsSelectorConcern` | Adds pinned apps selector functionality |
| `if respond_to?(:set_motd, true)` | Safely checks if method exists before calling |

#### 4.2 Update Dashboard Helper

**File:** `app/helpers/dashboard_helper.rb`

**Changes Made:**

```diff
  # Helper for the dashboard (root) page(s).
  module DashboardHelper
    # ... existing methods ...
    
    def pinned_apps?
-     @pinned_apps.present?
+     # Always return true so the widget always shows (even for first-time users)
+     true
    end

    def motd?
      @motd.present?
    end
    
+   def user_stats?
+     @user_stats.present?
+   end

    # ... existing methods ...
    
+   # Helper for user_stats widget - CSS badge colors for job states
+   def css_badge_for_state(state)
+     case state.to_s.downcase
+     when 'completed'
+       'bg-success'
+     when 'running'
+       'bg-primary'
+     when 'queued'
+       'bg-info'
+     when 'queued_held'
+       'bg-warning'
+     when 'suspended'
+       'bg-warning'
+     when 'failed'
+       'bg-danger'
+     else
+       'bg-secondary'
+     end
+   end
+   
+   # Helper method to generate app identifier for pinned apps
+   def app_identifier(app)
+     if app.respond_to?(:token)
+       "#{app.class.name.demodulize.downcase}_#{app.token}"
+     elsif app.respond_to?(:name)
+       "#{app.class.name.demodulize.downcase}_#{app.name}"
+     else
+       "#{app.class.name.demodulize.downcase}_#{app.object_id}"
+     end
+   end

    private

    def render_error_widget(error, widget_name)
      render(partial: 'shared/widget_error', locals: { error: error, widget: widget_name })
    end

    def default_dashboard_layout
      if xdmod?
-       if pinned_apps? || motd?
-         left_column = { width: 8, widgets: ['pinned_apps', 'motd'] }
+       if pinned_apps?
+         # User stats and custom MOTD in top row
+         top_row = { columns: [{ width: 12, widgets: ['user_stats'] }]}
+         # Custom MOTD in second row
+         motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
+         # XDMod and other widgets in third row
+         left_column = { width: 8, widgets: ['pinned_apps'] }
          right_column = { width: 4, widgets: ['xdmod_widget_job_efficiency', 'xdmod_widget_jobs'] }
+         bottom_row = { columns: [left_column, right_column] }
+         { rows: [top_row, motd_row, bottom_row] }
        else
+         # User stats and custom MOTD in top rows
+         top_row = { columns: [{ width: 12, widgets: ['user_stats'] }] }
+         motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
+         # XDMod widgets in third row
          left_column = { width: 4, widgets: ['xdmod_widget_job_efficiency'] }
          right_column = { width: 8, widgets: ['xdmod_widget_jobs'] }
+         bottom_row = { columns: [left_column, right_column] }
+         { rows: [top_row, motd_row, bottom_row] }
        end
-     elsif pinned_apps? && motd?
-       left_column = { width: 8, widgets: ['pinned_apps'] }
-       right_column = { width: 4, widgets: ['motd'] }
+     elsif pinned_apps?
+       # User stats at top, custom MOTD second, then pinned apps
+       top_row = { columns: [{ width: 12, widgets: ['user_stats'] }] }
+       motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
+       bottom_row = { columns: [{ width: 12, widgets: ['pinned_apps'] }] }
+       { rows: [top_row, motd_row, bottom_row] }
      else
-       left_column = { width: 12, widgets: ['pinned_apps', 'motd'] }
-       right_column = nil
+       # User stats at top, custom MOTD second
+       top_row = { columns: [{ width: 12, widgets: ['user_stats'] }] }
+       motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
+       { rows: [top_row, motd_row] }
      end
-
-     { rows: [{ columns: [left_column, right_column].compact }] }
    end

    # ... rest of existing methods ...
  end
```

**Full Updated Content:**

```ruby
# Helper for the dashboard (root) page(s).
module DashboardHelper
  #FIXME: copied from awesim-dev-dashboard
  def markdown(text)
    RenderManifestMarkdown.renderer.render(text)
  rescue
    text
  end

  def logo_image_tag(url)
    if url
      uri = Addressable::URI.parse(url)
      uri.query_values = (uri.query_values || {}).merge({timestamp: Time.now.to_i})
      tag.img(src: uri, alt: "logo", height: @user_configuration.dashboard_logo_height, class: 'py-2')
    else # default logo image
      image_tag("OpenOnDemand_stack_RGB.svg", alt: "logo", height: "85", class: 'py-2')
    end
  end

  def invalid_clusters
    @invalid_clusters ||= OodCore::Clusters.new(OodAppkit.clusters.select { |c| not c.valid? })
  end

  def xdmod?
    Configuration.xdmod_integration_enabled?
  end

  def pinned_apps?
    # Always return true so the widget always shows (even for first-time users)
    true
  end

  def motd?
    @motd.present?
  end

  def user_stats?
    @user_stats.present?
  end

  def dashboard_layout
    #FIXME: should sanitize the landing_page_layout or cast somethings to Array in the upper layers
    @user_configuration.dashboard_layout || default_dashboard_layout
  end

  def render_widget(widget)
    begin
      render partial: "widgets/#{widget}"
    rescue SyntaxError, StandardError => e
      render_error_widget(e, widget.to_s)
      # rubocop:disable Lint/RescueException - because these can throw all sorts of errors.
    rescue Exception => e
      # rubocop:enable Lint/RescueException
      render_error_widget(e, widget.to_s)
    end
  end

  # Helper for user_stats widget - CSS badge colors for job states
  def css_badge_for_state(state)
    case state.to_s.downcase
    when 'completed'
      'bg-success'
    when 'running'
      'bg-primary'
    when 'queued'
      'bg-info'
    when 'queued_held'
      'bg-warning'
    when 'suspended'
      'bg-warning'
    when 'failed'
      'bg-danger'
    else
      'bg-secondary'
    end
  end
  
  # Helper method to generate app identifier for pinned apps
  def app_identifier(app)
    if app.respond_to?(:token)
      "#{app.class.name.demodulize.downcase}_#{app.token}"
    elsif app.respond_to?(:name)
      "#{app.class.name.demodulize.downcase}_#{app.name}"
    else
      "#{app.class.name.demodulize.downcase}_#{app.object_id}"
    end
  end

  private

  def render_error_widget(error, widget_name)
    render(partial: 'shared/widget_error', locals: { error: error, widget: widget_name })
  end

  def default_dashboard_layout
    if xdmod?
      if pinned_apps?
        # User stats and custom MOTD in top row
        top_row = { columns: [
          { width: 12, widgets: ['user_stats'] },
        ]}
        # Custom MOTD in second row
        motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
        # XDMod and other widgets in third row
        left_column = { width: 8, widgets: ['pinned_apps'] }
        right_column = { width: 4, widgets: ['xdmod_widget_job_efficiency', 'xdmod_widget_jobs'] }
        bottom_row = { columns: [left_column, right_column] }
        { rows: [top_row, motd_row, bottom_row] }
      else
        # User stats and custom MOTD in top rows
        top_row = { columns: [{ width: 12, widgets: ['user_stats'] }] }
        motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
        # XDMod widgets in third row
        left_column = { width: 4, widgets: ['xdmod_widget_job_efficiency'] }
        right_column = { width: 8, widgets: ['xdmod_widget_jobs'] }
        bottom_row = { columns: [left_column, right_column] }
        { rows: [top_row, motd_row, bottom_row] }
      end
    elsif pinned_apps?
      # User stats at top, custom MOTD second, then pinned apps
      top_row = { columns: [{ width: 12, widgets: ['user_stats'] }] }
      motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
      bottom_row = { columns: [{ width: 12, widgets: ['pinned_apps'] }] }
      { rows: [top_row, motd_row, bottom_row] }
    else
      # User stats at top, custom MOTD second
      top_row = { columns: [{ width: 12, widgets: ['user_stats'] }] }
      motd_row = { columns: [{ width: 12, widgets: ['custom_motd'] }] }
      { rows: [top_row, motd_row] }
    end
  end

  def render_motd_rss_item(item)
    return '' unless item.description

    content = if Configuration.motd_render_html?
                item.description.html_safe
              else
                sanitize(item.description)
              end

    content_tag(:div, content, data: { 'motd-rss-item': true })
  end
end
```

---

## Configuration

### Routes Configuration

**File:** `config/routes.rb`

**Add this route:**

```ruby
Rails.application.routes.draw do
  # ... existing routes ...
  
  # Route for saving pinned apps
  post 'pinned_apps/save', to: 'pinned_apps#save', as: 'save_pinned_apps'
  
  # ... rest of your routes ...
end
```

**Location in file:** Add after the dashboard routes or at the end of the file before the final `end`.

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Widgets Not Appearing

**Symptoms:**
- Dashboard loads but widgets don't appear
- Blank spaces where widgets should be

**Solutions:**

1. **Check logs:**
```bash
tail -f log/production.log
# or
tail -f /var/log/ondemand-nginx/$USER/error.log
```

2. **Verify concerns are loaded:**
```bash
# In Rails console
rails c
DashboardController.included_modules
# Should see UserStatsConcern, CustomMotdConcern, PinnedAppsSelectorConcern
```

3. **Check widget rendering:**
- Verify files are in correct locations
- Check file permissions
- Restart application

#### Issue 2: No Applications in Pinned Apps Selector

**Symptoms:**
- Modal opens but shows "No applications available"

**Solutions:**

1. **Check application logs:**
Look for "Pinned Apps Debug" messages showing app counts

2. **Verify OodAppkit has apps:**
```bash
rails c
OodAppkit.apps.length
# Should return > 0
```

3. **Check @nav_groups:**
The concern has a fallback to use navigation groups if apps aren't found

#### Issue 3: JavaScript Errors

**Symptoms:**
- "bootstrap is not defined"
- Modal doesn't open
- Buttons don't work

**Solutions:**

1. **Check Bootstrap loading:**
- View page source
- Look for Bootstrap JS includes
- Verify nonce attribute is present

2. **Clear browser cache:**
```bash
# Hard refresh in browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

3. **Check console for errors:**
- Open browser DevTools (F12)
- Look at Console tab
- Check for script loading errors

#### Issue 4: Session Data Not Persisting

**Symptoms:**
- Pinned apps reset on page refresh
- Login time doesn't persist

**Solutions:**

1. **Check session configuration:**
```ruby
# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store, key: '_dashboard_session'
```

2. **Verify localStorage is enabled:**
```javascript
// In browser console
localStorage.setItem('test', '1');
localStorage.getItem('test');
// Should return '1'
```

3. **Check cookie settings:**
- Ensure cookies are enabled in browser
- Check for same-site cookie restrictions

#### Issue 5: Custom MOTD Not Loading

**Symptoms:**
- MOTD widget shows "No messages"
- YAML file not being read

**Solutions:**

1. **Verify file exists:**
```bash
ls -la config/custom_motd.yml
# or
ls -la /etc/ood/config/custom_motd.yml
```

2. **Check YAML syntax:**
```bash
ruby -e "require 'yaml'; YAML.load_file('config/custom_motd.yml')"
# Should not error
```

3. **Check file permissions:**
```bash
chmod 644 config/custom_motd.yml
```

4. **Check logs for parsing errors:**
```bash
grep "YAML syntax error" log/production.log
```

### Debug Mode

To enable more verbose logging, add this to your concern:

```ruby
# At the top of any concern
Rails.logger.level = :debug if Rails.env.production?
```

---

## Testing

### Manual Testing Checklist

#### User Stats Widget

- [ ] Widget appears on dashboard
- [ ] Username displays correctly
- [ ] Login time is formatted properly
- [ ] Session duration updates
- [ ] Job counts are accurate
- [ ] Running jobs count is correct
- [ ] Queued jobs count is correct
- [ ] Completed today count is correct
- [ ] Recent jobs table populates
- [ ] Job status badges have correct colors
- [ ] "View All Jobs" link works

#### Custom MOTD Widget

- [ ] Widget appears on dashboard
- [ ] Messages load from YAML file
- [ ] Messages are collapsible
- [ ] Chevron icon rotates on expand/collapse
- [ ] "Mark as Read" button works
- [ ] Read messages stay collapsed on refresh
- [ ] Read messages show with strike-through
- [ ] Priority badges show correct colors
- [ ] Markdown content renders correctly
- [ ] Container scrolls when many messages
- [ ] Empty state shows when no messages

#### Pinned Apps Selector

- [ ] Widget appears on dashboard
- [ ] "Edit Pinned Apps" button visible
- [ ] Modal opens on button click
- [ ] Modal shows on first visit (if no apps pinned)
- [ ] All available apps display in grid
- [ ] App icons display correctly
- [ ] Search box filters apps
- [ ] Checkboxes can be selected/deselected
- [ ] Selected count updates
- [ ] "Save Selection" saves to server
- [ ] Page reloads after save
- [ ] Pinned apps persist across sessions
- [ ] Selected apps appear in pinned apps widget
- [ ] Cancel button closes modal
- [ ] X button closes modal
- [ ] Modal closes on backdrop click
- [ ] Previously selected apps pre-checked

### Automated Testing

Create test files for automated testing:

**File:** `test/controllers/pinned_apps_controller_test.rb`

```ruby
require 'test_helper'

class PinnedAppsControllerTest < ActionDispatch::IntegrationTest
  test "should save pinned apps" do
    post save_pinned_apps_path, params: { pinned_app_ids: ['app1', 'app2'] }, as: :json
    assert_response :success
    assert_equal ['app1', 'app2'], session[:pinned_app_ids]
  end
  
  test "should reject invalid data" do
    post save_pinned_apps_path, params: { pinned_app_ids: 'invalid' }, as: :json
    assert_response :bad_request
  end
end
```

**File:** `test/helpers/dashboard_helper_test.rb`

```ruby
require 'test_helper'

class DashboardHelperTest < ActionView::TestCase
  test "css_badge_for_state returns correct classes" do
    assert_equal 'bg-success', css_badge_for_state('completed')
    assert_equal 'bg-primary', css_badge_for_state('running')
    assert_equal 'bg-info', css_badge_for_state('queued')
    assert_equal 'bg-danger', css_badge_for_state('failed')
  end
  
  test "app_identifier generates unique IDs" do
    app = OpenStruct.new(token: 'test123')
    assert_match /openstruct_test123/, app_identifier(app)
  end
end
```

Run tests:

```bash
# Run all tests
rails test

# Run specific test file
rails test test/controllers/pinned_apps_controller_test.rb

# Run with verbose output
rails test --verbose
```

---

## Performance Considerations

### Caching Recommendations

1. **Cache job data:**

```ruby
# In user_stats_concern.rb
def fetch_all_jobs
  Rails.cache.fetch("user_jobs_#{username}", expires_in: 1.minute) do
    # ... existing job fetching code ...
  end
end
```

2. **Cache available apps:**

```ruby
# In pinned_apps_selector_concern.rb
def fetch_all_available_apps
  Rails.cache.fetch("available_apps", expires_in: 5.minutes) do
    # ... existing app fetching code ...
  end
end
```

3. **Cache MOTD messages:**

```ruby
# In custom_motd_concern.rb
def load_custom_motd_messages
  Rails.cache.fetch("custom_motd", expires_in: 1.hour) do
    # ... existing MOTD loading code ...
  end
end
```

### Database Optimization

If storing preferences in database (future enhancement):

```ruby
# Create migration
rails generate migration AddPinnedAppsToUserSettings pinned_app_ids:text

# In migration
def change
  add_column :user_settings, :pinned_app_ids, :text
  add_index :user_settings, :user_id
end
```

---

## Security Considerations

### CSRF Protection

All POST requests include CSRF token:

```javascript
headers: {
  'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
}
```

### Input Validation

Controller validates input:

```ruby
def save
  pinned_app_ids = params[:pinned_app_ids] || []
  
  unless pinned_app_ids.is_a?(Array)
    render json: { error: 'Invalid data format' }, status: :bad_request
    return
  end
  
  # Additional validation
  pinned_app_ids = pinned_app_ids.select { |id| id.is_a?(String) && id.length < 200 }
  
  session[:pinned_app_ids] = pinned_app_ids
end
```

### Content Security Policy

All inline scripts use nonce:

```erb
<script nonce="<%= content_security_policy_nonce %>">
  // JavaScript# Open OnDemand Dashboard Customization Guide

## Complete Installation and Configuration Documentation

**Version:** 1.0  
**Last Updated:** November 10, 2024  
**Author:** Custom Dashboard Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Installation Steps](#installation-steps)
5. [File-by-File Changes](#file-by-file-changes)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [Testing](#testing)

---

## Overview

This guide provides comprehensive instructions for implementing three custom widgets for Open OnDemand:

1. **User Stats Widget** - Displays real-time job statistics, session information, and login details
2. **Custom MOTD Widget** - Interactive message-of-the-day with collapsible messages and mark-as-read functionality
3. **Pinned Apps Selector** - User-customizable pinned applications with modal selection interface

### Key Features

- ✅ Real-time job monitoring across all clusters
- ✅ Session tracking and duration calculation
- ✅ Interactive MOTD with persistent read state
- ✅ User-selectable pinned applications
- ✅ Responsive design for mobile and desktop
- ✅ Persistent storage using localStorage and session
- ✅ Comprehensive error handling

---

## Prerequisites

### System Requirements

- Open OnDemand installation (tested on version 2.x+)
- Ruby on Rails environment
- Access to the dashboard application directory
- Write permissions to application files

### Required Knowledge

- Basic Ruby on Rails concepts
- ERB template syntax
- YAML configuration
- JavaScript (ES6+)
- CSS/SCSS

### File System Access

You will need write access to:
```
/path/to/ondemand/dashboard/
├── app/
│   ├── assets/
│   ├── controllers/
│   ├── helpers/
│   └── views/
└── config/
```

---

## Architecture Overview

### Component Structure

```
┌─────────────────────────────────────────┐
│         Dashboard Controller            │
│  ┌────────────────────────────────────┐ │
│  │ Concerns (Mixins)                  │ │
│  │ • UserStatsConcern                 │ │
│  │ • CustomMotdConcern                │ │
│  │ • PinnedAppsSelectorConcern        │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Dashboard Helper                │
│  • Widget rendering                     │
│  • Layout management                    │
│  • Badge styling                        │
│  • App identification                   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Widget Views                    │
│  ┌────────────────────────────────────┐ │
│  │ _user_stats.html.erb               │ │
│  │ _custom_motd.html.erb              │ │
│  │ _pinned_apps.html.erb              │ │
│  │ _pinned_apps_selector_modal.html   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Request → Controller → Concerns (Load Data) → Helper (Layout) → Views (Render)
                                                                          │
                                                                          ▼
                                                                    JavaScript
                                                                    (Interactions)
                                                                          │
                                                                          ▼
                                                                    localStorage
                                                                    Session Storage
```

---

## Installation Steps

### Step 1: Backup Current Installation

**CRITICAL:** Always backup before making changes.

```bash
# Navigate to your dashboard directory
cd /path/to/ondemand/dashboard

# Create a backup
tar -czf dashboard_backup_$(date +%Y%m%d_%H%M%S).tar.gz app/ config/

# Verify backup
ls -lh dashboard_backup_*.tar.gz
```

### Step 2: Create Directory Structure

Ensure all necessary directories exist:

```bash
# From dashboard root directory
mkdir -p app/controllers/concerns
mkdir -p app/views/widgets/pinned_apps
mkdir -p app/assets/stylesheets
mkdir -p config
```

### Step 3: Install New Files

Follow the detailed instructions in the [File-by-File Changes](#file-by-file-changes) section below.

### Step 4: Modify Existing Files

Update the files listed in the "Modified Files" section.

### Step 5: Add Route Configuration

Update `config/routes.rb` (see [Routes Configuration](#routes-configuration)).

### Step 6: Restart Application

```bash
# Method 1: Touch restart file
touch tmp/restart.txt

# Method 2: Restart OnDemand service (if needed)
sudo systemctl restart ondemand
```

---

## File-by-File Changes

### 1. User Stats Widget

#### 1.1 Create User Stats Concern

**File:** `app/controllers/concerns/user_stats_concern.rb`

**Purpose:** Handles fetching and calculating user statistics including job counts and session information.

**Full Content:**

```ruby
# Concern for user statistics functionality
module UserStatsConcern
  extend ActiveSupport::Concern
  
  included do
    before_action :set_user_stats, only: [:index]
  end
  
  private
  
  def set_user_stats
    @user_stats = {
      username: username,
      login_time: format_login_time,
      session_duration: calculate_session_duration,
      last_activity: format_last_activity,
      running_jobs: count_jobs_by_state('running'),
      queued_jobs: count_jobs_by_state('queued'),
      total_active_jobs: count_active_jobs,
      completed_today: count_completed_today,
      recent_jobs: fetch_recent_jobs
    }
  rescue StandardError => e
    Rails.logger.error "Error fetching user stats: #{e.message}"
    @user_stats = default_user_stats
  end
  
  def username
    # Open OnDemand uses ENV['USER'] or request.env['REMOTE_USER']
    @username ||= ENV['USER'] || request.env['REMOTE_USER'] || 'unknown'
  end
  
  def format_login_time
    if session[:login_time]
      Time.at(session[:login_time]).strftime('%B %d, %Y at %I:%M %p')
    else
      session[:login_time] = Time.now.to_i
      Time.now.strftime('%B %d, %Y at %I:%M %p')
    end
  end
  
  def calculate_session_duration
    return 'N/A' unless session[:login_time]
    
    duration_seconds = Time.now.to_i - session[:login_time]
    hours = duration_seconds / 3600
    minutes = (duration_seconds % 3600) / 60
    
    if hours > 0
      "#{hours}h #{minutes}m"
    else
      "#{minutes}m"
    end
  end
  
  def format_last_activity
    Time.now.strftime('%I:%M %p')
  end
  
  def count_jobs_by_state(state)
    jobs = fetch_all_jobs
    jobs.count { |job| job.status.to_s.downcase == state }
  rescue StandardError => e
    Rails.logger.error "Error counting jobs by state: #{e.message}"
    0
  end
  
  def count_active_jobs
    jobs = fetch_all_jobs
    jobs.count { |job| ['running', 'queued', 'queued_held'].include?(job.status.to_s.downcase) }
  rescue StandardError => e
    Rails.logger.error "Error counting active jobs: #{e.message}"
    0
  end
  
  def count_completed_today
    jobs = fetch_all_jobs
    today_start = Time.now.beginning_of_day
    
    jobs.count do |job|
      job.status.to_s.downcase == 'completed' &&
      job.submit_time &&
      job.submit_time >= today_start
    end
  rescue StandardError => e
    Rails.logger.error "Error counting completed jobs: #{e.message}"
    0
  end
  
  def fetch_all_jobs
    @all_jobs ||= begin
      jobs = []
      OodAppkit.clusters.each do |cluster|
        next unless cluster.job_adapter
        next unless cluster.valid?
        
        begin
          cluster_jobs = cluster.job_adapter.info_all_each(attrs: [:id, :status, :job_name, :submit_time]).to_a
          jobs.concat(cluster_jobs.map { |job| job.to_h.merge(cluster: cluster.id) })
        rescue NoMethodError
          # Try alternative method if info_all_each doesn't exist
          cluster_jobs = cluster.job_adapter.info_all(attrs: [:id, :status, :job_name, :submit_time])
          jobs.concat(cluster_jobs.map { |job| job.to_h.merge(cluster: cluster.id) })
        end
      rescue StandardError => e
        Rails.logger.error "Error fetching jobs from #{cluster.id}: #{e.message}"
      end
      jobs
    end
  rescue StandardError => e
    Rails.logger.error "Error in fetch_all_jobs: #{e.message}"
    []
  end
  
  def fetch_recent_jobs
    jobs = fetch_all_jobs
    jobs.sort_by { |job| job[:submit_time] || Time.at(0) }
        .reverse
        .take(10)
        .map do |job|
          {
            id: job[:id],
            name: job[:job_name] || 'N/A',
            status: job[:status].to_s,
            submitted_at: job[:submit_time] ? job[:submit_time].strftime('%m/%d %I:%M %p') : 'N/A',
            cluster: job[:cluster] || 'Unknown'
          }
        end
  rescue StandardError => e
    Rails.logger.error "Error fetching recent jobs: #{e.message}"
    []
  end
  
  def default_user_stats
    {
      username: username,
      login_time: 'N/A',
      session_duration: 'N/A',
      last_activity: Time.now.strftime('%I:%M %p'),
      running_jobs: 0,
      queued_jobs: 0,
      total_active_jobs: 0,
      completed_today: 0,
      recent_jobs: []
    }
  end
end
```

**Key Methods:**

| Method | Purpose |
|--------|---------|
| `set_user_stats` | Main method that populates `@user_stats` hash |
| `username` | Gets current user from environment variables |
| `format_login_time` | Formats login time from session |
| `calculate_session_duration` | Calculates time since login |
| `count_jobs_by_state` | Counts jobs in specific state |
| `fetch_all_jobs` | Retrieves jobs from all clusters |
| `fetch_recent_jobs` | Gets 10 most recent jobs |

#### 1.2 Create User Stats View

**File:** `app/views/widgets/_user_stats.html.erb`

**Purpose:** Renders the user statistics widget with session info, job counts, and recent jobs.

**Full Content:**

```erb
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      <i class="fa fa-user"></i> User Statistics
    </h3>
  </div>
  <div class="panel-body">
    <div class="row">
      <div class="col-md-6">
        <h4 class="text-primary">Session Information</h4>
        <table class="table table-condensed">
          <tbody>
            <tr>
              <td><strong>Username:</strong></td>
              <td><%= @user_stats[:username] %></td>
            </tr>
            <tr>
              <td><strong>Login Time:</strong></td>
              <td><%= @user_stats[:login_time] %></td>
            </tr>
            <tr>
              <td><strong>Session Duration:</strong></td>
              <td><%= @user_stats[:session_duration] %></td>
            </tr>
            <tr>
              <td><strong>Last Activity:</strong></td>
              <td><%= @user_stats[:last_activity] %></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="col-md-6">
        <h4 class="text-success">Job Statistics</h4>
        <table class="table table-condensed">
          <tbody>
            <tr>
              <td><strong>Running Jobs:</strong></td>
              <td>
                <span class="badge bg-primary"><%= @user_stats[:running_jobs] %></span>
              </td>
            </tr>
            <tr>
              <td><strong>Queued Jobs:</strong></td>
              <td>
                <span class="badge bg-info"><%= @user_stats[:queued_jobs] %></span>
              </td>
            </tr>
            <tr>
              <td><strong>Total Active Jobs:</strong></td>
              <td>
                <span class="badge bg-success"><%= @user_stats[:total_active_jobs] %></span>
              </td>
            </tr>
            <tr>
              <td><strong>Completed Today:</strong></td>
              <td>
                <span class="badge bg-secondary"><%= @user_stats[:completed_today] %></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <% if @user_stats[:recent_jobs].any? %>
      <hr>
      <h4 class="text-info">Recent Jobs</h4>
      <div class="table-responsive">
        <table class="table table-striped table-condensed">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Name</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Cluster</th>
            </tr>
          </thead>
          <tbody>
            <% @user_stats[:recent_jobs].take(5).each do |job| %>
              <tr>
                <td><%= job[:id] %></td>
                <td><%= job[:name] %></td>
                <td>
                  <span class="badge <%= css_badge_for_state(job[:status]) %>">
                    <%= job[:status].capitalize %>
                  </span>
                </td>
                <td><%= job[:submitted_at] %></td>
                <td><%= job[:cluster] %></td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    <% end %>
    
    <div class="text-center" style="margin-top: 15px;">
      <%= link_to "View All Jobs", "/pun/sys/activejobs", class: "btn btn-primary btn-sm" %>
    </div>
  </div>
</div>
```

**Template Structure:**

- **Panel Header:** Widget title with icon
- **Session Information:** Left column with login details
- **Job Statistics:** Right column with job counts
- **Recent Jobs Table:** Last 5 submitted jobs (if any)
- **Action Link:** Button to view all jobs

#### 1.3 Create User Stats Stylesheet

**File:** `app/assets/stylesheets/user_stats.scss`

**Purpose:** Styles the user stats widget for consistent appearance.

**Full Content:**

```scss
// Styles for user stats widget

.user-stats {
  .panel-body {
    padding: 15px;
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  .table {
    margin-bottom: 0;
    
    td {
      padding: 8px;
      border-top: 1px solid #eee;
      
      &:first-child {
        width: 50%;
      }
    }
    
    tbody tr:first-child td {
      border-top: none;
    }
  }
  
  .badge {
    font-size: 13px;
    padding: 5px 10px;
    font-weight: normal;
  }
  
  .table-responsive {
    margin-top: 10px;
  }
  
  hr {
    margin: 20px 0;
    border-top: 1px solid #ddd;
  }
}

// Badge color classes for Bootstrap 5 compatibility
.badge.bg-primary {
  background-color: #007bff !important;
  color: white;
}

.badge.bg-success {
  background-color: #28a745 !important;
  color: white;
}

.badge.bg-info {
  background-color: #17a2b8 !important;
  color: white;
}

.badge.bg-warning {
  background-color: #ffc107 !important;
  color: #212529;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
  color: white;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
  color: white;
}
```

---

### 2. Custom MOTD Widget

#### 2.1 Create Custom MOTD Concern

**File:** `app/controllers/concerns/custom_motd_concern.rb`

**Purpose:** Loads and parses custom MOTD messages from YAML configuration file.

**Full Content:**

```ruby
# Concern for custom MOTD functionality
module CustomMotdConcern
  extend ActiveSupport::Concern
  
  included do
    before_action :set_custom_motd, only: [:index]
  end
  
  private
  
  def set_custom_motd
    @custom_motd_messages = load_custom_motd_messages
  rescue StandardError => e
    Rails.logger.error "Error loading custom MOTD: #{e.message}"
    @custom_motd_messages = []
  end
  
  def load_custom_motd_messages
    # Check if custom MOTD file exists
    motd_file = custom_motd_file_path
    
    return [] unless File.exist?(motd_file)
    
    # Load and parse YAML file
    messages = YAML.load_file(motd_file)
    
    # Ensure messages is an array and format each message
    Array(messages).map do |msg|
      {
        id: msg['id'] || SecureRandom.uuid,
        title: msg['title'] || 'Announcement',
        content: msg['content'] || msg['message'] || '',
        date: format_message_date(msg['date']),
        priority: msg['priority'] || 'info' # info, warning, danger, success
      }
    end
  rescue Psych::SyntaxError => e
    Rails.logger.error "YAML syntax error in custom MOTD file: #{e.message}"
    []
  rescue StandardError => e
    Rails.logger.error "Error parsing custom MOTD: #{e.message}"
    []
  end
  
  def custom_motd_file_path
    # Check multiple possible locations
    paths = [
      Rails.root.join('config', 'custom_motd.yml'),
      Rails.root.join('config', 'motd.yml'),
      Pathname.new('/etc/ood/config/custom_motd.yml'),
      Pathname.new(ENV['HOME']).join('.config', 'ondemand', 'custom_motd.yml')
    ]
    
    paths.find { |path| File.exist?(path) } || paths.first
  end
  
  def format_message_date(date)
    return nil unless date
    
    case date
    when Date, Time, DateTime
      date.strftime('%B %d, %Y')
    when String
      begin
        Date.parse(date).strftime('%B %d, %Y')
      rescue ArgumentError
        date
      end
    else
      date.to_s
    end
  end
end
```

**Configuration File Locations (in priority order):**

1. `Rails.root/config/custom_motd.yml`
2. `Rails.root/config/motd.yml`
3. `/etc/ood/config/custom_motd.yml`
4. `~/.config/ondemand/custom_motd.yml`

#### 2.2 Create Custom MOTD View

**File:** `app/views/widgets/_custom_motd.html.erb`

**Purpose:** Renders interactive MOTD widget with collapsible messages and mark-as-read functionality.

**Full Content:**

```erb
<div class="panel panel-default custom-motd-panel">
  <div class="panel-heading">
    <h3 class="panel-title">
      <i class="fa fa-bullhorn"></i> Message of the Day
      <% if @custom_motd_messages.present? %>
        <span class="badge bg-info"><%= @custom_motd_messages.length %></span>
      <% end %>
    </h3>
  </div>
  <div class="panel-body custom-motd-container">
    <% if @custom_motd_messages.present? %>
      <div class="custom-motd-messages" id="custom-motd-messages">
        <% @custom_motd_messages.each_with_index do |message, index| %>
          <div class="motd-message" id="motd-message-<%= message[:id] %>" data-message-id="<%= message[:id] %>">
            <div class="motd-message-header" data-bs-toggle="collapse" data-bs-target="#motd-content-<%= message[:id] %>" aria-expanded="true">
              <div class="motd-message-title">
                <i class="fa fa-chevron-down motd-chevron"></i>
                <span class="motd-title-text"><%= message[:title] %></span>
                <% if message[:date] %>
                  <small class="text-muted motd-date"><%= message[:date] %></small>
                <% end %>
              </div>
              <% if message[:priority] %>
                <span class="badge bg-<%= message[:priority] %> motd-priority"><%= message[:priority].capitalize %></span>
              <% end %>
            </div>
            
            <div class="collapse show motd-message-content" id="motd-content-<%= message[:id] %>">
              <div class="motd-message-body">
                <%= raw markdown(message[:content]) %>
              </div>
              <div class="motd-message-actions">
                <button 
                  class="btn btn-sm btn-outline-secondary mark-read-btn" 
                  data-message-id="<%= message[:id] %>"
                  onclick="markMessageAsRead('<%= message[:id] %>')">
                  <i class="fa fa-check"></i> Mark as Read
                </button>
              </div>
            </div>
          </div>
        <% end %>
      </div>
    <% else %>
      <div class="text-center text-muted">
        <p><i class="fa fa-inbox"></i></p>
        <p>No messages at this time.</p>
      </div>
    <% end %>
  </div>
</div>

<script nonce="<%= content_security_policy_nonce %>">
  // Track read messages in localStorage
  function getReadMessages() {
    const read = localStorage.getItem('motd_read_messages');
    return read ? JSON.parse(read) : [];
  }
  
  function saveReadMessages(readMessages) {
    localStorage.setItem('motd_read_messages', JSON.stringify(readMessages));
  }
  
  function markMessageAsRead(messageId) {
    const readMessages = getReadMessages();
    if (!readMessages.includes(messageId)) {
      readMessages.push(messageId);
      saveReadMessages(readMessages);
    }
    
    // Collapse the message
    const messageElement = document.getElementById('motd-message-' + messageId);
    const contentElement = document.getElementById('motd-content-' + messageId);
    
    if (messageElement && contentElement) {
      // Collapse content
      const bsCollapse = new bootstrap.Collapse(contentElement, { toggle: false });
      bsCollapse.hide();
      
      // Add read class for styling
      messageElement.classList.add('message-read');
      
      // Update button
      const btn = messageElement.querySelector('.mark-read-btn');
      if (btn) {
        btn.innerHTML = '<i class="fa fa-check-circle"></i> Read';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-outline-secondary');
        btn.disabled = true;
      }
    }
  }
  
  // Initialize: collapse and mark read messages on page load
  document.addEventListener('DOMContentLoaded', function() {
    const readMessages = getReadMessages();
    
    readMessages.forEach(function(messageId) {
      const messageElement = document.getElementById('motd-message-' + messageId);
      const contentElement = document.getElementById('motd-content-' + messageId);
      
      if (messageElement && contentElement) {
        // Start collapsed
        contentElement.classList.remove('show');
        messageElement.classList.add('message-read');
        
        // Update button
        const btn = messageElement.querySelector('.mark-read-btn');
        if (btn) {
          btn.innerHTML = '<i class="fa fa-check-circle"></i> Read';
          btn.classList.add('btn-success');
          btn.classList.remove('btn-outline-secondary');
          btn.disabled = true;
        }
      }
    });
    
    // Update chevron rotation on collapse/expand
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function(element) {
      element.addEventListener('click', function() {
        const chevron = this.querySelector('.motd-chevron');
        if (chevron) {
          setTimeout(function() {
            const target = element.getAttribute('data-bs-target');
            const targetElement = document.querySelector(target);
            if (targetElement && targetElement.classList.contains('show')) {
              chevron.style.transform = 'rotate(0deg)';
            } else {
              chevron.style.transform = 'rotate(-90deg)';
            }
          }, 50);
        }
      });
    });
  });
</script>
```

**JavaScript Features:**

- `getReadMessages()`: Retrieves read message IDs from localStorage
- `saveReadMessages()`: Saves read message IDs to localStorage
- `markMessageAsRead()`: Marks a message as read and collapses it
- **DOMContentLoaded**: Initializes collapsed state for previously read messages

#### 2.3 Create Custom MOTD Stylesheet

**File:** `app/assets/stylesheets/custom_motd.scss`

**Purpose:** Comprehensive styling for the custom MOTD widget with animations and responsive design.

**Full Content:**

```scss
// Styles for custom MOTD widget

.custom-motd-panel {
  margin-bottom: 20px;
  
  .panel-heading {
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
    padding: 12px 15px;
    
    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      
      i {
        color: #337ab7;
      }
      
      .badge {
        font-size: 11px;
        padding: 3px 8px;
      }
    }
  }
  
  .panel-body {
    padding: 0;
  }
}

.custom-motd-container {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  
  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #555;
    }
  }
}

.custom-motd-messages {
  display: flex;
  flex-direction: column;
}

.motd-message {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &.message-read {
    opacity: 0.7;
    
    .motd-message-header {
      background-color: #f8f9fa;
    }
    
    .motd-title-text {
      color: #6c757d;
      text-decoration: line-through;
    }
  }
}

.motd-message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &[aria-expanded="false"] .motd-chevron {
    transform: rotate(-90deg);
  }
}

.motd-message-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.motd-chevron {
  transition: transform 0.2s ease;
  color: #6c757d;
  font-size: 12px;
}

.motd-title-text {
  font-weight: 600;
  font-size: 15px;
  color: #333;
}

.motd-date {
  font-size: 12px;
  color: #6c757d;
  margin-left: 8px;
}

.motd-priority {
  font-size: 11px;
  padding: 4px 8px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.motd-message-content {
  border-top: 1px solid #f0f0f0;
  
  &.show {
    animation: slideDown 0.2s ease;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.motd-message-body {
  padding: 15px 15px 10px 40px;
  color: #555;
  line-height: 1.6;
  
  p {
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul, ol {
    margin-bottom: 10px;
    padding-left: 20px;
  }
  
  code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
  }
  
  pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  a {
    color: #337ab7;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.motd-message-actions {
  padding: 0 15px 15px 40px;
  display: flex;
  gap: 10px;
}

.mark-read-btn {
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  i {
    margin-right: 4px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &.btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }
}

// Priority badge colors
.badge.bg-info {
  background-color: #17a2b8 !important;
}

.badge.bg-warning {
  background-color: #ffc107 !important;
  color: #212529 !important;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
}

.badge.bg-success {
  background-color: #28a745 !important;
}

// Empty state
.custom-motd-container .text-muted {
  padding: 40px 20px;
  
  i {
    font-size: 48px;
    margin-bottom: 10px;
    opacity: 0.3;
  }
  
  p {
    margin: 0;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .custom-motd-container {
    max-height: 400px;
  }
  
  .motd-message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .motd-message-body {
    padding-left: 15px;
  }
  
  .motd-message-actions {
    padding-left: 15px;
  }
}
```

#### 2.4 Create Example MOTD Configuration

**File:** `config/custom_motd.yml`

**Purpose:** Example YAML configuration file for custom MOTD messages.

**Full Content:**

```yaml
# Custom MOTD Configuration File
# Place this file in one of these locations:
#   - /path/to/dashboard/config/custom_motd.yml
#   - /etc/ood/config/custom_motd.yml
#   - ~/.config/ondemand/custom_motd.yml

# Each message should have:
#   - id: unique identifier (will be auto-generated if not provided)
#   - title: message title
#   - content: message content (supports markdown)
#   - date: date of the message (optional)
#   - priority: info, warning, danger, or success (optional, defaults to info)

- id: maintenance-2024-11
  title: Scheduled Maintenance - November 15th
  date: 2024-11-01
  priority: warning
  content: |
    The cluster will undergo scheduled maintenance on **November 15th from 2:00 AM to 6:00 AM EST**.
    
    During this time:
    - All jobs will be suspended
    - Login nodes will be unavailable
    - File systems will be in read-only mode
    
    Please plan accordingly and save your work before the maintenance window.

- id: new-features-q4
  title: New Features Available
  date: 2024-10-28
  priority: success
  content: |
    We're excited to announce new features now available on the cluster:
    
    1. **GPU Nodes**: 10 new A100 GPU nodes added
    2. **Extended Storage**: Home directory quotas increased to 500GB
    3. **Jupyter Lab**: Now supports custom kernels and extensions
    
    Visit our [documentation](https://docs.example.com) for more details.

- id: policy-update
  title: Updated Usage Policy
  date: 2024-10-15
  priority: info
  content: |
    Please review our updated usage policy:
    
    - Maximum job runtime: 72 hours (previously 48 hours)
    - Storage cleanup: Files older than 90 days in `/scratch` will be automatically removed
    - Fair share policy now in effect for job scheduling
    
    For questions, contact support@example.com

- id: security-reminder
  title: Security Reminder
  date: 2024-10-01
  priority: danger
  content: |
    **Important Security Reminders:**
    
    - Never share your credentials with anyone
    - Use strong passwords and change them regularly
    - Enable two-factor authentication if available
    - Report suspicious activity immediately
    
    Stay safe and keep your account secure!

- id: tips-and-tricks
  title: Tips for Efficient Job Submission
  date: 2024-09-20
  priority: info
  content: |
    Make the most of your compute time:
    
    ```bash
    # Request only the resources you need
    sbatch --nodes=1 --ntasks=4 --time=01:00:00 job.sh
    
    # Use array jobs for similar tasks
    sbatch --array=1-100 array_job.sh
    
    # Monitor your jobs
    squeue -u $USER
    ```
    
    Check out our [best practices guide](https://docs.example.com/best-practices) for more tips!
```

**Message Priority Options:**

| Priority | Color | Use Case |
|----------|-------|----------|
| `info` | Blue | General announcements |
| `success` | Green | New features, improvements |
| `warning` | Yellow | Upcoming maintenance, policy changes |
| `danger` | Red | Critical security notices, urgent issues |

---

### 3. Pinned Apps Selector

#### 3.1 Create Pinned Apps Selector Concern

**File:** `app/controllers/concerns/pinned_apps_selector_concern.rb`

**Purpose:** Manages user-selectable pinned applications with persistent storage.

**Full Content:**

```ruby
# Concern for user-selectable pinned apps functionality
module PinnedAppsSelectorConcern
  extend ActiveSupport::Concern
  
  included do
    before_action :set_pinned_apps_data, only: [:index]
  end
  
  private
  
  def set_pinned_apps_data
    # Load all available apps
    @all_available_apps = fetch_all_available_apps
    
    # If no apps found, try alternative method
    if @all_available_apps.empty? && defined?(@nav_groups)
      Rails.logger.info "Trying to get apps from @nav_groups"
      @all_available_apps = fetch_apps_from_nav_groups
    end
    
    # Load user's pinned app preferences
    @user_pinned_app_ids = load_user_pinned_apps
    
    # Filter to get actual pinned apps
    @pinned_apps = filter_pinned_apps(@all_available_apps, @user_pinned_app_ids)
    
    # Determine if this is first visit
    @is_first_visit = @user_pinned_app_ids.nil? || @user_pinned_app_ids.empty?
    
    Rails.logger.info "Pinned Apps Debug: Available apps: #{@all_available_apps.length}, Pinned IDs: #{@user_pinned_app_ids.inspect}, Pinned apps: #{@pinned_apps.length}, First visit: #{@is_first_visit}"
  rescue StandardError => e
    Rails.logger.error "Error setting pinned apps data: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    @all_available_apps = []
    @pinned_apps = []
    @user_pinned_app_ids = []
    @is_first_visit = true
  end
  
  def fetch_all_available_apps
    # Get all available apps from OodAppkit
    apps = []
    
    begin
      # Try different methods to get apps
      if defined?(OodAppkit) && OodAppkit.respond_to?(:apps)
        all_apps = OodAppkit.apps
        Rails.logger.info "Found #{all_apps.length} apps from OodAppkit.apps"
        
        # Filter apps that should appear in nav
        apps = all_apps.select do |app| 
          should_show = if app.respond_to?(:should_appear_in_nav?)
            app.should_appear_in_nav?
          else
            true
          end
          Rails.logger.info "App: #{app.title} - should_show: #{should_show}"
          should_show
        end
      elsif defined?(OodApp)
        # Fallback: try to get apps directly
        all_apps = OodApp.all
        Rails.logger.info "Found #{all_apps.length} apps from OodApp.all"
        apps = all_apps
      end
    rescue StandardError => e
      Rails.logger.error "Error in initial app fetch: #{e.message}"
      Rails.logger.error e.backtrace.first(5).join("\n")
    end
    
    # Sort by title
    sorted_apps = apps.sort_by { |app| app.title.to_s.downcase }
    Rails.logger.info "Returning #{sorted_apps.length} sorted apps"
    sorted_apps
  rescue StandardError => e
    Rails.logger.error "Error fetching available apps: #{e.message}"
    Rails.logger.error e.backtrace.first(5).join("\n")
    []
  end
  
  def load_user_pinned_apps
    # Try to load from session first
    pinned_ids = session[:pinned_app_ids]
    
    Rails.logger.info "Loading pinned apps from session: #{pinned_ids.inspect}"
    
    # Return the value (could be nil, empty array, or array with IDs)
    pinned_ids
  rescue StandardError => e
    Rails.logger.error "Error loading user pinned apps: #{e.message}"
    nil
  end
  
  def filter_pinned_apps(all_apps, pinned_ids)
    return [] if pinned_ids.nil? || pinned_ids.empty? || all_apps.empty?
    
    # Filter apps to only include pinned ones, maintaining order
    pinned_apps = pinned_ids.map do |app_id|
      all_apps.find { |app| app_identifier(app) == app_id }
    end.compact
    
    Rails.logger.info "Filtered pinned apps: #{pinned_apps.length} apps from #{pinned_ids.length} IDs"
    
    pinned_apps
  rescue StandardError => e
    Rails.logger.error "Error filtering pinned apps: #{e.message}"
    []
  end
  
  def app_identifier(app)
    # Create a unique identifier for each app
    if app.respond_to?(:token)
      "#{app.class.name.demodulize.downcase}_#{app.token}"
    elsif app.respond_to?(:name)
      "#{app.class.name.demodulize.downcase}_#{app.name}"
    else
      "#{app.class.name.demodulize.downcase}_#{app.object_id}"
    end
  end
  
  def fetch_apps_from_nav_groups
    # Alternative method: get apps from nav groups (used in navigation)
    apps = []
    
    if defined?(@nav_groups) && @nav_groups.respond_to?(:each)
      @nav_groups.each do |group|
        if group.respond_to?(:apps)
          apps.concat(group.apps)
        end
      end
      Rails.logger.info "Found #{apps.length} apps from nav_groups"
    end
    
    apps.uniq
  rescue StandardError => e
    Rails.logger.error "Error fetching apps from nav groups: #{e.message}"
    []
  end
end
```

**Key Features:**

- **Multi-source app loading**: Tries multiple methods to fetch available apps
- **Session persistence**: Stores user selections in session
- **Fallback mechanisms**: Falls back to nav_groups if primary method fails
- **Comprehensive logging**: Detailed logging for troubleshooting
- **Error handling**: Graceful degradation on errors

#### 3.2 Create Pinned Apps Selector Modal

**File:** `app/views/widgets/_pinned_apps_selector_modal.html.erb`

**Purpose:** Large modal interface for selecting pinned applications with search and visual selection.

**Full Content:**

```erb
<!-- Pinned Apps Selector Modal -->
<div class="modal fade" id="pinnedAppsModal" tabindex="-1" role="dialog" aria-labelledby="pinnedAppsModalLabel">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="pinnedAppsModalLabel">
          <i class="fa fa-thumbtack"></i> Select Your Pinned Applications
        </h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalBtn"></button>
      </div>
      
      <div class="modal-body">
        <div class="alert alert-info">
          <i class="fa fa-info-circle"></i>
          <strong>Welcome!</strong> Select the applications you want to pin to your dashboard for quick access. You can change these selections anytime by clicking the "Edit Pinned Apps" button.
        </div>
        
        <!-- Search box -->
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control form-control-lg" 
            id="appSearchInput" 
            placeholder="Search applications..."
            autocomplete="off">
        </div>
        
        <!-- App selection grid -->
        <div class="row" id="appSelectionGrid">
          <% if @all_available_apps.present? %>
            <% @all_available_apps.each do |app| %>
              <% 
                app_id = app_identifier(app)
                link = app.links.first rescue nil
                tile_data = link&.tile || {}
                icon_uri = tile_data.fetch(:icon, link&.icon_uri) rescue nil
              %>
              <div class="col-md-3 col-sm-4 col-6 app-select-item" data-app-name="<%= app.title.to_s.downcase %>">
                <div class="app-select-card" data-app-id="<%= app_id %>">
                  <div class="app-select-checkbox">
                    <input 
                      type="checkbox" 
                      class="app-checkbox" 
                      id="app-<%= app_id %>" 
                      value="<%= app_id %>"
                      data-app-title="<%= app.title %>">
                  </div>
                  <label for="app-<%= app_id %>" class="app-select-label">
                    <div class="app-select-icon">
                      <% if icon_uri %>
                        <%= icon_tag(URI(icon_uri.to_s)) rescue content_tag(:i, '', class: 'fa fa-cube fa-3x') %>
                      <% else %>
                        <i class="fa fa-cube fa-3x"></i>
                      <% end %>
                    </div>
                    <div class="app-select-title"><%= app.title %></div>
                    <% if link&.caption %>
                      <div class="app-select-caption"><%= link.caption %></div>
                    <% end %>
                  </label>
                </div>
              </div>
            <% end %>
          <% else %>
            <div class="col-12 text-center text-muted py-5">
              <i class="fa fa-inbox fa-3x mb-3"></i>
              <p>No applications available</p>
              <small>Debug: @all_available_apps = <%= @all_available_apps.inspect %></small>
            </div>
          <% end %>
        </div>
        
        <!-- Selected count -->
        <div class="alert alert-secondary mt-3" id="selectedCountAlert">
          <strong><span id="selectedCount">0</span></strong> application(s) selected
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="cancelModalBtn">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" id="savePinnedAppsBtn">
          <i class="fa fa-save"></i> Save Selection
        </button>
      </div>
    </div>
  </div>
</div>

<script nonce="<%= content_security_policy_nonce %>">
(function() {
  'use strict';
  
  const STORAGE_KEY = 'user_pinned_apps';
  const modal = document.getElementById('pinnedAppsModal');
  const saveBtn = document.getElementById('savePinnedAppsBtn');
  const cancelBtn = document.getElementById('cancelModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const searchInput = document.getElementById('appSearchInput');
  const selectedCountSpan = document.getElementById('selectedCount');
  const isFirstVisit = <%= @is_first_visit ? 'true' : 'false' %>;
  
  // Load saved pinned apps
  function loadPinnedApps() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading pinned apps:', e);
      return [];
    }
  }
  
  // Save pinned apps
  function savePinnedApps(appIds) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appIds));
      return true;
    } catch (e) {
      console.error('Error saving pinned apps:', e);
      return false;
    }
  }
  
  // Update selected count
  function updateSelectedCount() {
    const checked = document.querySelectorAll('.app-checkbox:checked');
    selectedCountSpan.textContent = checked.length;
  }
  
  // Initialize checkboxes with saved selections
  function initializeSelections() {
    const pinnedApps = loadPinnedApps();
    pinnedApps.forEach(appId => {
      const checkbox = document.getElementById('app-' + appId);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.closest('.app-select-card').classList.add('selected');
      }
    });
    updateSelectedCount();
  }
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const items = document.querySelectorAll('.app-select-item');
      
      items.forEach(item => {
        const appName = item.dataset.appName;
        if (appName.includes(searchTerm)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
  
  // Handle checkbox changes
  document.querySelectorAll('.app-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const card = this.closest('.app-select-card');
      if (this.checked) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
      updateSelectedCount();
    });
  });
  
  // Handle save button
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const checkedBoxes = document.querySelectorAll('.app-checkbox:checked');
      const selectedApps = Array.from(checkedBoxes).map(cb => cb.value);
      
      if (savePinnedApps(selectedApps)) {
        // Save to server session
        fetch('<%= save_pinned_apps_path if respond_to?(:save_pinned_apps_path) %>', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify({ pinned_app_ids: selectedApps })
        }).then(response => {
          if (response.ok) {
            closeModal();
            // Reload after short delay
            setTimeout(function() {
              window.location.reload();
            }, 300);
          } else {
            alert('Error saving pinned apps. Please try again.');
          }
        }).catch(error => {
          console.error('Error:', error);
          alert('Error saving pinned apps. Please try again.');
        });
      }
    });
  }
  
  // Handle cancel/close buttons
  function closeModal() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      } else {
        // If no instance, try to create one and hide it
        const newModal = new bootstrap.Modal(modal);
        newModal.hide();
      }
    } else if (typeof $ !== 'undefined' && $.fn.modal) {
      $(modal).modal('hide');
    } else {
      // Manual close with proper cleanup
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      
      document.body.classList.remove('modal-open');
      
      // Remove all backdrops
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      
      // Remove inline styles that might interfere
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  }
  
  // Also handle backdrop clicks
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Show modal on first visit
  document.addEventListener('DOMContentLoaded', function() {
    initializeSelections();
    
    if (isFirstVisit) {
      // Try Bootstrap 5 first, then jQuery fallback
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const bsModal = new bootstrap.Modal(modal, {
          backdrop: 'static',
          keyboard: false
        });
        bsModal.show();
      } else if (typeof $ !== 'undefined' && $.fn.modal) {
        $(modal).modal({
          backdrop: 'static',
          keyboard: false
        });
      } else {
        // Fallback: show modal by adding classes manually
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  });
  
  // Global function to open modal (for edit button)
  window.openPinnedAppsSelector = function() {
    // Try Bootstrap 5 first, then jQuery fallback
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    } else if (typeof $ !== 'undefined' && $.fn.modal) {
      $(modal).modal('show');
    } else {
      // Fallback: show modal by adding classes manually
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      
      // Create backdrop if it doesn't exist
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  };
})();
</script>
```

**JavaScript Functions:**

| Function | Purpose |
|----------|---------|
| `loadPinnedApps()` | Loads pinned app IDs from localStorage |
| `savePinnedApps()` | Saves pinned app IDs to localStorage |
| `updateSelectedCount()` | Updates the count of selected apps |
| `initializeSelections()` | Pre-selects checkboxes based on saved data |
| `closeModal()` | Closes modal with proper cleanup |
| `window.openPinnedAppsSelector()` | Global function to open modal |

#### 3.3 Create Pinned Apps Selector Stylesheet

**File:** `app/assets/stylesheets/pinned_apps_selector.scss`

**Purpose:** Comprehensive styling for the pinned apps selector modal.

**Full Content:**

```scss
// Styles for pinned apps selector modal

#pinnedAppsModal {
  .modal-xl {
    max-width: 1200px;
  }
  
  .modal-header {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    
    .modal-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #333;
      font-weight: 600;
      
      i {
        color: #337ab7;
      }
    }
  }
  
  .modal-body {
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px;
  }
}

// Search box
#appSearchInput {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #337ab7;
    box-shadow: 0 0 0 0.2rem rgba(51, 122, 183, 0.15);
  }
}

// App selection grid
#appSelectionGrid {
  min-height: 300px;
}

.app-select-item {
  margin-bottom: 20px;
  padding: 0 10px;
}

.app-select-card {
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    border-color: #337ab7;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  &.selected {
    border-color: #28a745;
    background-color: #f0f8f4;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
    
    .app-select-checkbox input {
      border-color: #28a745;
      background-color: #28a745;
      
      &::after {
        opacity: 1;
      }
    }
  }
}

.app-select-checkbox {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  
  input[type="checkbox"] {
    width: 24px;
    height: 24px;
    cursor: pointer;
    appearance: none;
    border: 2px solid #ccc;
    border-radius: 6px;
    background: white;
    position: relative;
    transition: all 0.2s ease;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 16px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    &:checked {
      background-color: #28a745;
      border-color: #28a745;
      
      &::after {
        opacity: 1;
      }
    }
    
    &:hover {
      border-color: #337ab7;
    }
  }
}

.app-select-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  margin: 0;
  width: 100%;
  padding-top: 10px;
}

.app-select-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  
  img, svg {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.app-select-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.3;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-select-caption {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
  margin-top: 4px;
}

// Selected count alert
#selectedCountAlert {
  text-align: center;
  margin-bottom: 0;
  background-color: #e7f3ff;
  border: 1px solid #b3d9ff;
  color: #004085;
  
  #selectedCount {
    font-size: 18px;
    color: #337ab7;
  }
}

// Edit button for pinned apps widget
.edit-pinned-apps-btn {
