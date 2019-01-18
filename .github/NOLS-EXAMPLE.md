## NOLS EXAMPLE

If you're still confused about NOLS, this visual example should help explain what NOLS does in a real project.

### Original SCSS - iPhone X

<img src="https://i.imgur.com/haGjSPw.png" alt="NOLS" align="left" width="225">

This is the design layout that you start with. It's pretty simple, but for this example, it's all we need, to get to know what NOLS does for you.

I have written this example code for an iPhone X, which has the viewport values of: **height:** `812px`, **width:** `375px`.

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
Now this looks quite nice on the iPhone X. It looks exactly how we want it to. But if we change the device to one of a different viewport, we don't get the same results. :sweat: 
<br><br>


### Original SCSS - Other Devices

|Pixel 2 XL _______________|Galaxy 5S _____________|Pixel 2 ___________________ |iPhone 6, 7, 8 PLUS |
|-----------------|----------------------|:------------------:|:-------------------------------:|

<img src="https://i.imgur.com/des3vyM.png" alt="iPad" align="left" width="202">
<img src="https://i.imgur.com/y1k2uJW.png" alt="Galaxy_5S" align="left" width="202">
<img src="https://i.imgur.com/CuT4GgK.png" alt="Pixel_2" align="left" width="202">
<img src="https://i.imgur.com/Ewb751o.png" alt="iPhone_6_7_8_Plus" align="left" width="202">

<h3 align="left">_____________________________________________</h3>

As you can see, the above layouts don't look the same as the layout on the iPhone X in the first example, which isn't what we want. We want it to look the same, no matter what device is displaying the page.

### NOLS SCSS - Any Device

Here are the results after we run the `nols` command in default mode and input our height of `812px`, and width of `375px`, which was the original viewport values of the iPhone X we were using when we designed the page.

|Pixel 2 XL _______________|Galaxy 5S _____________|Pixel 2 ___________________ |iPhone 6, 7, 8 PLUS |
|-----------------|----------------------|:------------------:|:-------------------------------:|

<img src="https://i.imgur.com/Qr8DFuI.png" alt="iPad_2" align="left" width="202">
<img src="https://i.imgur.com/ttk40A8.png" alt="Galaxy_5S" align="left" width="202">
<img src="https://i.imgur.com/f6OLeeH.png" alt="Pixel_2" align="left" width="202">
<img src="https://i.imgur.com/Ka1KpYf.png" alt="iPhone_6_7_8_Plus" align="left" width="202">

<h3 align="left">_________________________</h3>

### SCSS - Converted by NOLS

```
.test-img {
  margin-top: 2.4630541871921183vh; /* NOLS Converted from: 20px; */
  height: 24.63054187192118vh; /* NOLS Converted from: 200px; */
  width: 40vw; /* NOLS Converted from: 150px; */
  margin-left: 5.333333333333333vw; /* NOLS Converted from: 20px; */
}
```

Now as you can see -  NOLS leaves behind comments in the converted CSS. 
This is because NOLS also has the ability to revert changes it makes - through the use of these comments. 
So if something goes wrong with a conversion, god forbid - running nols under the `revert` mode, will cause all changes that NOLS has made, to be reverted to their original values.

If you wanted to get rid of these comments, you can run NOLS under the `clean` mode, and all comments will be removed. 
Though this also makes it so that you can no longer revert previous changes made by nols. So use this after you've checked your project.

I hope this makes NOLS make a little bit more sense! If you have any additional questions, not answered here or in the Readme, please feel free to open an issue in it!
