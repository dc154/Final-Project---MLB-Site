---
layout: layout.html
pageTitle: New York Today
navTitle: Home
tags: post
---

## Articles

{% for post in collections.post %}

  <h2><a href="{{ post.url }}">{{ post.data.pageTitle }}</a></h2>
  <em>{{ post.date | date: "%Y-%m-%d" }}</em>
{% endfor %}

## Articles

<button>Show Stories</button>

