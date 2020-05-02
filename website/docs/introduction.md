---
id: introduction
title: Introduction
---

Nuz is an ecosystem to manage runtime packages for web platform.

In the current way, to develop web applications with many internal components, you need to either put them all into one repository or separate them into small modules and then `require / import` them in more than you use in the main project. But when deploying that application, you need to bundle all the code into once and then release them, and then you need to upgrade or fix a small component inside you that you have to bundle all, which sometimes doesn't necessary.

