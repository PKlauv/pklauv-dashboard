---
title: GestureMute
description: macOS menu bar app that lets you mute, unmute, and adjust mic volume with hand gestures via your webcam.
tech:
  - Python
  - Swift
  - macOS
status: active
github: https://github.com/PKlauv/GestureMute
featured: true
---

GestureMute is a macOS menu bar app that uses your webcam to detect hand gestures for controlling microphone state. Raise a hand to mute, lower it to unmute, or use specific gestures to adjust volume — all without touching your keyboard.

## How it works

A Python backend uses MediaPipe for real-time hand tracking via the webcam. It communicates with a native Swift menu bar app that handles the actual macOS audio controls. The two components talk over a local bridge.

## Features

- Mute/unmute with a simple hand raise
- Adjust mic volume with gesture-based controls
- Lives in the menu bar — minimal UI footprint
- Onboarding flow for first-time setup

## Built with

- Python with MediaPipe for hand gesture recognition
- Swift for the native macOS menu bar app
- Inter-process communication between Python and Swift
