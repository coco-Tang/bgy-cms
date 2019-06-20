<script>
import { mapGetters } from 'vuex'

export default {
  name: 'base-dialog',
  props: {
    title: {type: String, default: '提示'},
    autowidth: { type: Boolean, default: false },
    show: { type: Boolean, default: false },
    size: { type: Number, default: 510 }, // 310 510 610 750 830 950
    titleStlye: {type: Object, default: () => {}},
    footerStlye: {type: Object, default: () => {}},
    footerNone: {type: Boolean, default: false}, // 标记是否隐藏el-dialog-foot, 默认为false显示
    top: { type: String, default: '10%'},
    modal: { type: Boolean, default: true},
    clickModalClose: { type: Boolean, default: true}
  },
  computed: {
    ...mapGetters(['dialog_close'])
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$emit('submit')
    },
    open() {
      this.$emit('open')
    }
  },
  watch: {
    // vue 中 dialog_close 为 true 时，弹窗会自动关闭，使用这个功能可让所有弹窗都关闭
    dialog_close (val) {
      if ( ! val) return false
      this.$emit('close')
    }
  }
}
</script>

<template>
<el-dialog :visible.sync="show" :class="[ footerNone ? 'footer_none' : '']" :lock-scroll="true" :before-close="close" :close-on-click-modal="clickModalClose"
  :custom-class="autowidth ? '' : `w${size}_dialog`" :top="top" :modal="modal" @open="open">

  <div slot="title" class="dialog_header" :style="titleStlye">
    <slot name="header">
      <h4 slot="title" class="dialog_title">{{ title }}</h4>
    </slot>
  </div>

  <slot>弹窗内容</slot>

  <div slot="footer">
    <slot name="footer">
      <div slot="footer" class="dialog_footer">
        <el-button @click.stop="close">取 消</el-button>
        <el-button type="primary" @click.stop="submit">确 定</el-button>
      </div>
    </slot>
  </div>

</el-dialog>
</template>

<style scoped lang="scss">

.dialog_header {
  display: inline-block;
}

</style>
