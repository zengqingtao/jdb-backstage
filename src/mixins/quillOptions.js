// 修改vue-quill-editor富文本options
import ImageResize from 'quill-image-resize-module'
// 图片大小
Quill.register('modules/imageResize', ImageResize)
    // 字号
let fontSizeStyle = Quill.import('attributors/style/size')
fontSizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px']
Quill.register(fontSizeStyle, true)

export default {
    data() {
        return {
            editorOption: {
                placeholder: "请在此输入文本...",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline"],
                        [{ header: 1 }, { header: 2 }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ direction: "rtl" }],
                        [{ size: fontSizeStyle.whitelist }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ color: ["#e1251b", "#333", "#999999", "#eeeeee", "#4d75ff"] }],
                        [{ font: [] }],
                        [{ align: [] }],
                        ["link", "image"]
                    ],
                    imageResize: {
                        displayStyles: {
                            backgroundColor: "black",
                            border: "none",
                            color: "white"
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"]
                    }
                }
            },
        }
    }
}