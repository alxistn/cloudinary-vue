import {mount} from "@vue/test-utils";
import CldImage from "../../../src/components/CldImage/CldImage.vue";

import testWithMockedIntersectionObserver from './utils/testWithMockedIntersectionObserver';
import mountImageComponent from './utils/mountImageComponent';

describe("Tests for CldImage", () => {
  it("Does not render anything with no publicId", () => {
    let {imgSrc} = mountImageComponent({
      publicId: ''
    });

    expect(imgSrc).toBe(undefined);
  });

  it("Renders with a publicId", () => {
    let {imgSrc} = mountImageComponent({
      publicId: 'sample123'
    });

    expect(imgSrc).toBe(`http://res.cloudinary.com/demo/image/upload/sample123`);
  });

  it("Ignores an unknown accessibility mode", () => {
    let {imgSrc} = mountImageComponent({
      accessibility: 'UNSUPPORTED_ACCESSIBILITY_MODE'
    });

    expect(imgSrc).toBe(`http://res.cloudinary.com/demo/image/upload/face_top`);
  });

  // TODO Move to acessibility file
  it("Renders accessibility mode with darkmode", () => {
    let {imgSrc} = mountImageComponent({
      accessibility: 'darkmode'
    });
    expect(imgSrc).toContain(`http://res.cloudinary.com/demo/image/upload/e_tint:75:black/face_top`);
  });

  // TODO Move to acessibility file
  it("Renders accessibility mode with brightmode", () => {
    let {imgSrc} = mountImageComponent({
      accessibility: 'brightmode'
    });
    expect(imgSrc).toContain(`http://res.cloudinary.com/demo/image/upload/e_tint:50:white/face_top`);
  });

  // TODO Move to acessibility file
  it("Renders accessibility mode with monochrome", () => {
    let {imgSrc} = mountImageComponent({
      accessibility: 'monochrome'
    });
    expect(imgSrc).toContain(`http://res.cloudinary.com/demo/image/upload/e_grayscale/face_top`);
  });

  // TODO Move to acessibility file
  it("Renders accessibility mode with colorblind", () => {
    let {imgSrc} = mountImageComponent({
      accessibility: 'colorblind'
    });
    expect(imgSrc).toContain(`http://res.cloudinary.com/demo/image/upload/e_assist_colorblind/face_top`);
  });

  it('Loads the image only when in viewport (intersection observer)', () => {
    testWithMockedIntersectionObserver((mockIntersectionCallback) => {
      // Create an instance
      let {wrapper} = mountImageComponent({
        loading: 'lazy',
        placeholder: 'color'
      });

      // Since we're lazy loading, we expect not to be visible
      expect(wrapper.vm.visible).toBe(false);

      // Mock an intersection call, this should turn the component visible
      mockIntersectionCallback([{
        target: wrapper.element,
        isIntersecting: true
      }]);

      // Component should now be visible
      expect(wrapper.vm.visible).toBe(true);
    });
  });

  it('Shows the placeholder while the image is still loading(lazyload)', () => {
    testWithMockedIntersectionObserver((mockIntersectionCallback) => {
      let {wrapper, imgSrc} = mountImageComponent({
        loading: 'lazy',
        placeholder: 'color'
      });

      // Show placeholder
      expect(imgSrc).toBe(`http://res.cloudinary.com/demo/image/upload/$nh_ih,$nw_iw,c_scale,q_1,w_1/c_scale,h_$nh,w_$nw/face_top`);
    });
  });

  it("Supports transformation props", () => {
    let {wrapper, imgSrc} = mountImageComponent({
      cloudName: 'demo',
      publicId: 'face_top',
      effect:'sepia'
    });

    expect(imgSrc).toBe(`http://res.cloudinary.com/demo/image/upload/e_sepia/face_top`);
  });

  it("Cascades non-cloudinary configuration attributes to the HTML img tag", () => {
    let {wrapper, image, imgSrc} = mountImageComponent({
      cloudName: 'demo',
      publicId: 'face_top',
      'aria-hidden': true,
      'some-future-html-prop': true
    });

    expect(imgSrc).toBe(`http://res.cloudinary.com/demo/image/upload/face_top`);
    expect(image.attributes("aria-hidden")).toBe("true");
    expect(image.attributes("some-future-html-prop")).toBe("true");
    expect(image.attributes("cloudName")).toBe(undefined);
  });

  it("Cascades width and height to the HTML img tag", () => {
    let {wrapper, image, imgSrc} = mountImageComponent({
      cloudName: 'demo',
      publicId: 'face_top',
      width:100,
      height:200
    });

    expect(image.attributes("src")).toBe(`http://res.cloudinary.com/demo/image/upload/face_top`);
    expect(image.attributes("width")).toBe("100");
    expect(image.attributes("height")).toBe("200");
  });
});