<div>

    <script>
        $(document).ready(function () {
            mw.top().dialog.get('.mw_modal_live_edit_settings').resize(900);
        });
    </script>

    <div x-data="{
    showEditTab: 'content'
    }">

        <div class="d-flex justify-content-between align-items-center collapseNav-initialized form-control-live-edit-label-wrapper">
            <div class="d-flex flex-wrap gap-md-4 gap-3">
                <a href="#" x-on:click="showEditTab = 'content'" :class="{ 'active': showEditTab == 'content' }"
                   class="btn btn-link text-decoration-none mw-admin-action-links mw-adm-liveedit-tabs active">
                    Posts
                </a>
                <a href="#" x-on:click="showEditTab = 'settings'" :class="{ 'active': showEditTab == 'settings' }"
                   class="btn btn-link text-decoration-none mw-admin-action-links mw-adm-liveedit-tabs">
                    Settings
                </a>
            </div>
        </div>

        <div x-show="showEditTab=='content'">

            <div> 
                <livewire:admin-posts-list />
                <livewire:admin-content-bulk-options />
            </div>

        </div>
        <div x-show="showEditTab=='settings'">
            This is the settings tab
        </div>

    </div>

</div>