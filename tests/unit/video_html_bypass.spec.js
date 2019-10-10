import Vue from "vue";
import { mount } from "@vue/test-utils";
import CldVideo from "../../src/components/CldVideo/CldVideo.vue";

describe("CldVideo", () => {
  it("bypasses non-cloudinary attributes", async () => {
    const wrapper = mount({
      template: `
        <cld-video cloudName="demo" publicId="face_top" aria-hidden="true" />
      `,
      components: { CldVideo }
    });

    const video = wrapper.find('video');

    expect(video.is("video")).toBe(true);
    expect(video.attributes("aria-hidden")).toBe("true");
    expect(video.attributes("cloudName")).toBe(undefined);
  });
});
