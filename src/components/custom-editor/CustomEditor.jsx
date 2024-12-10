import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { getMediaURL } from 'helpers';
// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';
import { LinearProgress } from '@mui/material';

const CustomEditor = ({ initialValue = '', onChange = () => {}, readonly = false, ...props }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className='text-editor-wrap mb-3 w-full'>
      {loading && (
        <div className='loader-wrap-editor'>
          <LinearProgress color='#000' />
        </div>
      )}
      <Editor
        className='editor-card'
        // apiKey={process.env.REACT_APP_EDITOR_TOKEN}
        onInit={(evt, editor) => (editorRef.current = editor)}
        plugins='advlist lists wordcount autoresize link image emoticons charmap file basic-tools'
        // onChange={handleChange}
        // initialValue={initialValue}
        // onBlur={handleBlur}
        // onFocus={handleFocus}

        ref={editorRef}
        onNodeChange={(e) => {
          if (e && e.element.nodeName.toLowerCase() === 'img') {
            editorRef.current.dom.setAttribs(e.element, {
              width: '500px',
              height: 'auto',
            });
          }
        }}
        init={{
          image_description: false,
          menubar: false,
          branding: false,
          height: 400,
          readonly: true,
          skin: 'oxide-dark',
          content_css: 'dark',
          statusbar: false,
          toolbar: 'bold italic underline bullist numlist indent outdent link image file',
          // plugins: [
          //     'link image'
          //   ],
          browser_spellcheck: true,
          image_title: true,
          body_id: 'tiny_content_body',
          content_style: `
            @import url('https://fonts.cdnfonts.com/css/helvetica-neue-55');
            body { 
              background-color: #333333 !important; 
              color: #BFBFBF !important; 
              font-family: 'Helvetica Neue', helvetica; 
            }
            a{
              colour: #fff !important;
              background-color:"#333333 !important";
            }
            `,
          font_family_formats:
            'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          template_mdate_format: '%m/%d/%Y : %H:%M',
          templates: [
            {
              title: 'Date modified example',
              description: 'Adds a timestamp indicating the last time the document modified.',
              content:
                '<p>Last Modified: <time class="mdate">This will be replaced with the date modified.</time></p>',
            },
          ],
          automatic_uploads: true,
          file_picker_types: 'image file',
          // images_upload_url:`${process.env.REACT_APP_API_URL}/user/uploadAnyFiles`,
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*,pdf/*');
            input.onchange = function () {
              var file = this.files[0];
              var reader = new FileReader();
              reader.onload = async function () {
                setLoading(true);
                let response = await getMediaURL(file);
                cb(response, { title: file.name });
                setLoading(false);
              };
              reader.readAsDataURL(file);
            };
            input.click();
          },
          color_picker_callback: function (callback, value) {
            // Customize the color picker to use hexadecimal color codes
            if (value) {
              // If a color is selected, convert it to hexadecimal
              if (value.indexOf('rgb') === 0) {
                // Parse the RGB value
                const rgb = value.match(/(\d+),\s*(\d+),\s*(\d+)/);
                if (rgb) {
                  const hexColor = `#${parseInt(rgb[1], 10)
                    .toString(16)
                    .padStart(2, '0')}${parseInt(rgb[2], 10)
                    .toString(16)
                    .padStart(2, '0')}${parseInt(rgb[3], 10).toString(16).padStart(2, '0')}`;
                  callback(hexColor);
                }
              } else {
                // If it's already in hexadecimal format, pass it through
                callback(value);
              }
            }
          },
        }}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

// export default CustomEditor;
export default CustomEditor;
