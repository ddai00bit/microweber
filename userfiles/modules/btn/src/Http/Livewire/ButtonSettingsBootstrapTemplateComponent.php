<?php

namespace MicroweberPackages\Modules\Btn\Http\Livewire;

use MicroweberPackages\LiveEdit\Http\Livewire\ModuleSettingsComponent;

class ButtonSettingsBootstrapTemplateComponent extends ModuleSettingsComponent
{

    public array $settings = [

        'button_style' => '',
        'button_size' => '',
    ];

    public function render()
    {
        return view('modules.btn::livewire.bootstrap_settings');
    }



}