import type { Directive, DirectiveBinding } from "vue";

export const loading: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      el.classList.add("c-loading");
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (value) {
      el.classList.add("c-loading");
    } else {
      el.classList.remove("c-loading");
    }
  },

  beforeUnmount(el: HTMLElement) {
    el.classList.remove("c-loading");
  },
};
