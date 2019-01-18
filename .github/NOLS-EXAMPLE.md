## Introduction

This is a quick example about what NOLS can do for your hybrid app. This is a simple example of a complex problem with hybrid app development, and how NOLS helps fix that.

### Original SCSS - iPhone X

<img src="https://i.imgur.com/haGjSPw.png" alt="NOLS" align="left" width="225">

Let's say that this is the design layout that you start with. It's pretty simple, but for this example, it's all we need, to understand what NOLS does.

I have written this example code for an iPhone X, which has the viewport values of: **height:** `812px`, **width:** `375px`.
If you want, you can follow along [here](#).

##### HTML
```
<img class="test-img" *ngFor="let img of images" [src]="img">
```
#### SCSS
```
.test-img {
  margin-top: 20px;
  height: 200px;
  width: 150px;
  margin-left: 20px;
}
```
Now this looks quite nice on the iPhone X. It looks exactly how we want it to. But if we change the device to one that has a different viewport, we don't get the same results. :sweat: 
<br><br>


### Original SCSS - Other Devices

|Pixel 2 XL _______________|Galaxy 5S _____________|Pixel 2 ___________________ |iPhone 6, 7, 8 PLUS |
|-----------------|----------------------|:------------------:|:-------------------------------:|

<img src="https://i.imgur.com/GOATy6j.png" alt="Original_design_all_devices" align="center">

Here you can see how the original code from the first example, shows up on different devices. The black border is just to show the device border. As you probably can see, the layout changes based on what device is currently displaying it. This isn't what we want, what we want is a uniform look, based on what we originally designed.

### NOLS SCSS - Any Device

Here is the result after we run the **`nols`** command in **Default** mode. NOLS will ask for your device dimensions, which in this example, had a view-height of `812px` and a view-width of `375px`, and then handles making the calculations for you. 


|Pixel 2 XL _______________|Galaxy 5S _____________|Pixel 2 ___________________ |iPhone 6, 7, 8 PLUS |
|-----------------|----------------------|:------------------:|:-------------------------------:|

<img src="https://i.imgur.com/czG43Cu.jpg" alt="NOLS_design_all_devices" align="center">

As you can see, the original design now renders the same, regardless of what device is displaying it. The takeaway from this? You can now write CSS once, use **`nols`**, and run your code anywhere.

### SCSS - Converted by NOLS

Here is the SCSS after we run the `nols` command in **Default** mode.

```
.test-img {
  margin-top: 2.4630541871921183vh; /* NOLS Converted from: 20px; */
  height: 24.63054187192118vh; /* NOLS Converted from: 200px; */
  width: 40vw; /* NOLS Converted from: 150px; */
  margin-left: 5.333333333333333vw; /* NOLS Converted from: 20px; */
}
```

#### What's with the comments?

You probably noticed that NOLS inserted some comments into the above CSS. This is because NOLS has the ability to revert conversions it has made previously, through the use of these comments. If you want to revert changes made by NOLS, all you have to do is select the the **`Revert`** mode when you run **`nols`**, and nols will revert those conversions to their original values. 

If you wanted to get rid of these comments, you can run NOLS under the **Clean** mode, and all comments left behind by NOLS will be removed.

Please note though, that this also makes it impossible to revert previous changes by NOLS down the line. So only use this mode after you've checked that your project.

#### How does NOLS do all of this? 

NOLS starts off by asking you a few questions: 

1. Your entry folder - the folder you'd like NOLS to start in. 
2. Your device dimensions - The device view-height and view-width you're developing in.

Afterwards, NOLS reads through every stylesheet that is inside that entry folder, and it's sub-folders.
When it gets to a [supported attribute](https://github.com/Bengejd/NOLS#supported-attributes), it determines the proper calculation to make, runs the calculation, and then writes the calculated value into your stylesheet.

To actually make the calculation, NOLS uses the following formula: 

`(attribute_value_in_pixels * 100) / viewport_value`. With the viewport_value being either your view-height or view-width, depending on the attribute.

#### Thanks for reading!

I hope this makes NOLS make a little bit more sense! If you have any additional questions, not answered here or in the [Readme](https://github.com/Bengejd/NOLS#important-notes), please feel free to open an [issue](https://github.com/Bengejd/NOLS/issues) about it!
