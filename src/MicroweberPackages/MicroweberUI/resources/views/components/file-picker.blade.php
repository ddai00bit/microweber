@props(['label' => '','allowedType'=>'images'])

<div>

    @php
        $randId = rand(111,999).time();
    @endphp
    <div>

        <input type="hidden" id="js-media-picker-image-{{$randId}}" {!! $attributes->merge([]) !!} />

        <div id="js-preview-image-wrapper-{{$randId}}" style="display:none">
            <div class="d-flex gap-6">
                <div>
                    <img src="" id="js-preview-image-{{$randId}}" />
                </div>
                <div>
                    <x-microweber-ui::button class="js-select-image-{{$randId}}">
                        Change
                    </x-microweber-ui::button>
                    <br />
                    <x-microweber-ui::danger-button class="js-remove-image-{{$randId}}">
                        Remove
                    </x-microweber-ui::danger-button>
                </div>
            </div>
        </div>

        <div id="js-dropzone-image-{{$randId}}" class="dropzone mw-dropzone js-select-image-{{$randId}}">
            <div class="d-flex flex-column align-items-center gap-3">
                <div style="background:rgba(0,0,0,0.11);color:#000;width:40px;height:40px; border-radius:100%; font-size:28px;">
                    <i class="mdi mdi-plus"></i>
                </div>
                <div>
                    <b>
                        {{ $label }}
                    </b>
                </div>
                <div>
                     <span>
                        <b>20MB Max</b>
                    </span>
                </div>
            </div>
        </div>

        <script>
            $(document).ready(function() {

                let mediaPickerImageField = document.getElementById('js-media-picker-image-{{$randId}}');

                if (mediaPickerImageField.value !== '') {
                    $('#js-dropzone-image-{{$randId}}').hide();
                    $('#js-preview-image-{{$randId}}').attr('src',  mediaPickerImageField.value);
                    $('#js-preview-image-wrapper-{{$randId}}').show();
                }

                $('.js-remove-image-{{$randId}}').click(function() {
                    $('#js-preview-image-wrapper-{{$randId}}').hide();
                    $('#js-dropzone-image-{{$randId}}').show();
                    mediaPickerImageField.value = '';
                    mediaPickerImageField.dispatchEvent(new Event('input'));
                });

                $('.js-select-image-{{$randId}}').click(function() {
                    var dialog;
                    var picker = new mw.filePicker({
                        type: '{{$allowedType}}',
                        label: false,
                        autoSelect: false,
                        footer: true,
                        _frameMaxHeight: true,
                        onResult: function (res) {
                            var url = res.src ? res.src : res;
                            if(!url) return;
                            url = url.toString();

                            $('#js-dropzone-image-{{$randId}}').hide();
                            $('#js-preview-image-{{$randId}}').attr('src', url);
                            $('#js-preview-image-wrapper-{{$randId}}').show();

                            mediaPickerImageField.value = url;
                            mediaPickerImageField.dispatchEvent(new Event('input'));

                            dialog.remove();
                        }
                    });
                    dialog = mw.top().dialog({
                        content: picker.root,
                        title: mw.lang('Select image'),
                        footer: false,
                        width: 860
                    });
                });
            });
        </script>

    </div>
</div>