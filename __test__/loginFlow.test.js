import { mount } from "@vue/test-utils";
import Login from "@/views/login/index.vue";

describe("Login", () => {
  it("renders properly", () => {
    const wrapper = mount(Login);
    expect(wrapper.html()).toContain("登录");
  });
});
