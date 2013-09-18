AngularOverlay Directive
===============

![AngularOverlay Directive Example](https://raw.github.com/DanWahlin/AngularOverlay/master/AngularOverlay/content/images/appExample.png)

The AngularOverlay directive intercepts $http and jQuery XHR calls and displays and overlay. To get started using it follows these steps:

1. Add the directive script located in app/directives/wcAngularOverlay.js into your project and reference the wc.Directives module:
2. Reference the wc.Directives module:

	angular.module('customersApp', ['ngRoute', 'wc.Directives']);

3. Add the following styles into a CSS stylesheet (tweak as needed):

	.overlayContainer { display: none;}<br />
	.overlayBackground { top:0px; left:0px; padding-left:100px;position:absolute;z-index:1000;height:100%;width:100%;background-color:#808080;opacity:0.3;}<br />
	.overlayContent { position:absolute; border: 1px solid #000; background-color:#fff;font-weight: bold;height: 100px;width: 300px;z-index:1000;text-align:center;}<br />

4. Add the directive into your main shell page:

```html
<div wc-overlay wc-overlay-delay="300">
	Loading message or HTML content (such as an image) goes here
</div>
```
