<?php

Route::group(['middleware' => 'admin', 'namespace' => '\MicroweberPackages\LiveEdit\Http\Controllers'], function () {

    $admin_url = mw_admin_prefix_url();

    $live_edit_url = 'live-edit';

    Route::any('/' . $admin_url . '/' . $live_edit_url, 'LiveEditIframeController@index')
        ->name('admin.live-edit.index')
        ->middleware(['live_edit']);


    Route::any('/admin/live-edit-dev-preview', 'LiveEditIframeController@devPreview')
        ->name('admin.live-edit.dev-preview')
        ->middleware(['live_edit']);

});
