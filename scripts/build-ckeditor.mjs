import { build } from 'vite'
import { copyFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const outDir = join(root, 'public', 'ckeditor')
const tmpEntryDir = join(root, '.cache-ckbuild')

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
mkdirSync(tmpEntryDir, { recursive: true })

const entryFile = join(tmpEntryDir, 'entry.js')

writeFileSync(
  entryFile,
  `import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Bold, Italic, Underline, Strikethrough } from '@ckeditor/ckeditor5-basic-styles'
import { FontSize, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font'
import { Alignment } from '@ckeditor/ckeditor5-alignment'
import { List } from '@ckeditor/ckeditor5-list'
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent'
import { Link, AutoLink, LinkImage } from '@ckeditor/ckeditor5-link'
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line'
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table'
import {
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  ImageInsert,
  ImageInsertViaUrl,
  AutoImage
} from '@ckeditor/ckeditor5-image'
import { FileRepository } from '@ckeditor/ckeditor5-upload'
import { MediaEmbed, AutoMediaEmbed } from '@ckeditor/ckeditor5-media-embed'
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office'
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format'
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing'
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support'
import thTranslations from 'ckeditor5/translations/th.js'

function extractYouTubeId(rawUrl) {
  if (!rawUrl) return null
  const input = String(rawUrl).trim()
  const patterns = [
    /(?:youtube(?:-nocookie)?\\.com\\/watch\\?(?:[^#\\s]*&)?v=)([A-Za-z0-9_-]{6,20})/i,
    /(?:youtu\\.be\\/)([A-Za-z0-9_-]{6,20})/i,
    /(?:youtube(?:-nocookie)?\\.com\\/(?:embed|shorts|live|v)\\/)([A-Za-z0-9_-]{6,20})/i
  ]
  for (const pat of patterns) {
    const m = input.match(pat)
    if (m && m[1]) return m[1]
  }
  return null
}

class FirezoneUploadAdapter {
  constructor(loader, uploadUrl, onStateChange) {
    this.loader = loader
    this.uploadUrl = uploadUrl || '/api/admin/upload'
    this.onStateChange = onStateChange
    this.xhr = null
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          if (!file) {
            reject('ไม่พบไฟล์รูปภาพ')
            return
          }
          if (typeof this.onStateChange === 'function') this.onStateChange(true, '')

          const xhr = new XMLHttpRequest()
          this.xhr = xhr
          xhr.open('POST', this.uploadUrl, true)
          xhr.responseType = 'json'
          xhr.withCredentials = true

          xhr.addEventListener('error', () => {
            if (typeof this.onStateChange === 'function') {
              this.onStateChange(false, 'เกิดข้อผิดพลาดเครือข่ายระหว่างอัปโหลดรูปภาพ')
            }
            reject('เกิดข้อผิดพลาดเครือข่ายระหว่างอัปโหลดรูปภาพ')
          })

          xhr.addEventListener('abort', () => {
            if (typeof this.onStateChange === 'function') this.onStateChange(false, '')
            reject()
          })

          xhr.addEventListener('load', () => {
            const res = xhr.response
            if (xhr.status < 200 || xhr.status >= 300 || !res || !res.url) {
              const msg =
                (res && (res.statusMessage || res.message || (res.error && res.error.message))) ||
                'อัปโหลดรูปภาพไม่สำเร็จ'
              if (typeof this.onStateChange === 'function') this.onStateChange(false, msg)
              reject(msg)
              return
            }
            if (typeof this.onStateChange === 'function') this.onStateChange(false, '')
            resolve({ default: res.url })
          })

          if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt) => {
              if (evt.lengthComputable) {
                this.loader.uploadTotal = evt.total
                this.loader.uploaded = evt.loaded
              }
            })
          }

          const data = new FormData()
          const safeName = file.name && /\\.[a-z0-9]+$/i.test(file.name) ? file.name : 'clipboard-image.png'
          data.append('file', file, safeName)
          xhr.send(data)
        })
    )
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }
}

function FirezoneUploadAdapterPlugin(editor) {
  const uploadUrl = editor.config.get('firezoneUploadUrl') || '/api/admin/upload'
  const onStateChange = editor.config.get('firezoneOnUploadState')
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new FirezoneUploadAdapter(loader, uploadUrl, onStateChange)
  }
}

class FirezoneClassicEditor extends ClassicEditor {}

FirezoneClassicEditor.builtinPlugins = [
  Essentials,
  Autoformat,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Alignment,
  List,
  Indent,
  IndentBlock,
  Link,
  AutoLink,
  LinkImage,
  BlockQuote,
  HorizontalLine,
  Table,
  TableToolbar,
  FileRepository,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
  ImageInsert,
  ImageInsertViaUrl,
  AutoImage,
  MediaEmbed,
  AutoMediaEmbed,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  GeneralHtmlSupport
]

FirezoneClassicEditor.defaultConfig = {
  licenseKey: 'GPL',
  language: 'th',
  translations: [thTranslations],
  extraPlugins: [FirezoneUploadAdapterPlugin],
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'alignment',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
      '|',
      'link',
      'insertImage',
      'mediaEmbed',
      'blockQuote',
      'insertTable',
      'horizontalLine',
      '|',
      'removeFormat',
      'sourceEditing',
      '|',
      'undo',
      'redo'
    ],
    shouldNotGroupWhenFull: false
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'ย่อหน้าปกติ (Paragraph)', class: 'ck-heading_paragraph' },
      { model: 'heading2', view: 'h2', title: 'หัวข้อหลัก (H2)', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'หัวข้อรอง (H3)', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'หัวข้อย่อย (H4)', class: 'ck-heading_heading4' }
    ]
  },
  fontSize: {
    options: [12, 14, 'default', 18, 20, 24, 30],
    supportAllValues: true
  },
  alignment: {
    options: ['left', 'center', 'right', 'justify']
  },
  image: {
    resizeOptions: [
      { name: 'resizeImage:original', value: null, label: 'ขนาดจริง (100%)' },
      { name: 'resizeImage:75', value: '75', label: '75%' },
      { name: 'resizeImage:50', value: '50', label: '50%' },
      { name: 'resizeImage:25', value: '25', label: '25%' }
    ],
    toolbar: [
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'resizeImage',
      '|',
      'toggleImageCaption',
      'imageTextAlternative',
      'linkImage'
    ]
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  },
  mediaEmbed: {
    previewsInData: true,
    providers: [
      {
        name: 'youtube',
        url: [
          /^(?:https?:\\/\\/)?(?:www\\.|m\\.)?youtube(?:-nocookie)?\\.com\\/watch\\?(?:[^#\\s]*&)?v=([\\w-]{6,20})/i,
          /^(?:https?:\\/\\/)?(?:www\\.|m\\.)?youtube(?:-nocookie)?\\.com\\/(?:embed|shorts|live|v)\\/([\\w-]{6,20})/i,
          /^(?:https?:\\/\\/)?youtu\\.be\\/([\\w-]{6,20})/i
        ],
        html: (match) => {
          const id = match[1] || extractYouTubeId(match[0])
          if (!id) return ''
          return (
            '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;background:#000;">' +
            '<iframe src="https://www.youtube.com/embed/' + id + '" ' +
            'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" ' +
            'title="YouTube video player" referrerpolicy="strict-origin-when-cross-origin" ' +
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
            'allowfullscreen></iframe></div>'
          )
        }
      }
    ]
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://'
  },
  htmlSupport: {
    allow: [
      {
        name: /^(div|span|p|section|article|h1|h2|h3|h4|h5|h6|ul|ol|li|table|thead|tbody|tr|th|td|figure|figcaption|img|a|blockquote|hr|br|strong|em|u|s|iframe)$/i,
        attributes: true,
        classes: true,
        styles: true
      }
    ]
  }
}

window.ClassicEditor = FirezoneClassicEditor
window.FirezoneClassicEditor = FirezoneClassicEditor
export default FirezoneClassicEditor
`
)

await build({
  configFile: false,
  publicDir: false,
  logLevel: 'info',
  build: {
    emptyOutDir: true,
    outDir,
    minify: 'esbuild',
    sourcemap: false,
    lib: {
      entry: entryFile,
      name: 'ClassicEditor',
      formats: ['iife'],
      fileName: () => 'ckeditor.js'
    }
  }
})

copyFileSync(
  join(root, 'node_modules', 'ckeditor5', 'dist', 'ckeditor5.css'),
  join(outDir, 'ckeditor.css')
)
copyFileSync(
  join(root, 'node_modules', 'ckeditor5', 'dist', 'ckeditor5-content.css'),
  join(outDir, 'ckeditor-content.css')
)

rmSync(tmpEntryDir, { recursive: true, force: true })
console.log('Built standalone public/ckeditor/{ckeditor.js,ckeditor.css,ckeditor-content.css}!')
