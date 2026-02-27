---
layout: post
title: "Faith in Kids: The Christmas Build Up"
description: "Turning a Hackathon Project into a Usable Christmas Digital Devotional for Kids"
date: 2024-12-01
image: "/assets/images/blog/cbu-calendar.png" 
tags: ["projects", "11ty"]
youtube: true
---
# Faith in Kids: Building a Digital Sticker Book

This Advent, I had the privilege of building a digital experience for **Faith in Kids**, a charity dedicated to helping children and families explore the Christian faith together. The project, "The Christmas Story", is an interactive Advent calendar that unlocks daily content like videos, podcasts and colouring sheets.

The real icing on the cake is that every day there is a new sticker to add to a special digital sticker book. This means kids can build up their own lego nativity scene over the course of advent.

---

{% youtube "54Bf1tabgZY", "Faith in Kids: The Christmas Build Up" %}

## The Concept
The project was born at the **Kingdom Code Build 2024** Hackathon. Faith in Kids arrived with a creative challenge: how to take their "Christmas Brick by Brick" devotional—a series of Lego-themed lessons—and turn it into a compelling digital experience. The goal was to create a daily habit for families that felt less like a chore and more like a game, using the Lego imagery to bridge the gap between the physical and digital worlds.

At the heart of the experience sits a digital nativity scene. The idea was simple: build something tactile and fun where kids collect stickers each day and drag them onto a stable background to create their own unique scene.

We were able to build a working prototype but it had some niggles and annoyingly it failed us at the moment of truth during the showcase at the end! Faith in kids were pleased with what we'd done so far but this was the end of october and they wanted to turn it production ready in time for advent!

## Leveraging the Existing CMS
One of the biggest questions was how to manage the daily content—the videos, podcasts, and PDFs. At Build24, James Doc suggested a pragmatic approach: don't build a new backend. Instead, leverage the charity's existing WordPress site.

By treating WordPress as a "Headless CMS" and fetching data via its REST API, I could pull the advent content directly into the eleventy build. This allowed the Faith in Kids team to use the tools they were already comfortable with, while I focused on building the app.

Eleventy’s global data feature makes it easy to pull content from external sources during the build. By connecting to the WordPress API, I could fetch the daily advent lessons and make that data available to every template in the project, ensuring a fast, static experience powered by their existing CMS.

To bridge the gap, I built a custom WordPress plugin to expose the specific metadata I needed. By using `register_rest_field`, I could inject custom fields—like the advent day number and sticker image URLs—directly into the REST API response, making them easily accessible to Eleventy during the build.

```php
add_action('rest_api_init', function () {
    register_rest_field('post', 'advent_data', [
        'get_callback' => function ($post) {
            return [
                'day'     => get_post_meta($post['id'], 'advent_day', true),
                'sticker' => get_post_meta($post['id'], 'sticker_url', true),
            ];
        }
    ]);
});
```


This data is then available globally in templates as `post`. So generating pages for each day was as simple as using Eleventy's pagination feature:

```yaml
---
pagination:
  data: post
  size: 1
  alias: day
permalink: "posts/day-{{ day.day }}/"
---
```

From here it was pretty smooth sailing apart from one geometric headache...

> **The Challenge:** How do I ensure that a sticker placed on a stable roof on a mobile phone stays on the roof when viewed on a desktop or tablet?

## The Technical Solution: Fixed Geometry & CSS Scaling

Usually, good web design is all about *fluidity*—letting content expand and contract to fit whatever screen size is thrown at it. But here’s the rub: for a sticker book where positioning matters, fluidity is a nightmare. If the background image scales differently than the coordinate system, your carefully placed stickers end up floating in mid-air!

To solve this, I used a **Fixed Coordinate System** combined with **CSS Scaling**.

### 1. The "Universe" is 2000px Wide

My solution? A fixed universe. I decided the internal logic would *always* assume a width of `2000px`. No matter what device you’re holding, the JavaScript stubbornly believes it has 2000 pixels of horizontal space to play with.

When a user drags a sticker, the code stores its `x` and `y` coordinates in `localStorage` exactly as they are within this massive 2000px wide container.

### 2. The Viewport as a Window

Of course, most phones are only 300-400 pixels wide. To fit my 2000px "universe" into a mobile screen without scrollbars, I used a CSS `transform`.

On every window resize, the code calculates a `zoomFactor`:

```javascript
const baseWidth = 2000;
const currentWidth = $(window).width();
const zoomFactor = currentWidth / baseWidth;
```

If the screen is 1000px wide, the `zoomFactor` is `0.5`. I then apply this scale to the sticker book container:

```javascript
$('#stickerbookframe').css({
  transform: `scale(${zoomFactor})`,
  width: (currentWidth / zoomFactor) + "px", // Force width back to 2000px effectively
});
```

![Sticker Book Screenshot](/assets/images/blog/cbu-stable.png)

### 3. Visual Consistency

This approach separates the *logic* of placement from the *presentation*.

- **Logic:** "The sheep is at x=1500, y=500." (Always true, regardless of device).
- **Presentation:** "The screen is small, so show the entire 2000px world at 20% size."

It turns out kids are pretty comprehensive testers but now if a child places Mary and Joseph in the center of the stable on their dad's phone, they’re still right there in the exact same spot when they open the page on a laptop later. The geometry is preserved perfectly across all devices.

---

## The Result

This has been a huge success for Faith in Kids with lots of families using it over advent. I've had a number of messages from parents saying how much their kids have enjoyed it and how it's helped them talk about the Christmas story together.

For the last two advents, my son has been using it every day to build his nativity scene! He especially loves trying to break the game by placing stickers in impossible positions...

I'm incredibly proud to have supported Faith in Kids in bringing this story to life. Check them out [here](https://faithinkids.org)