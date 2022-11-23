name: 'Microsoft Teams Webhook Message Bot'
description: 'GitHub Action to send a message to Microsoft Teams using a webhook - Included an advanced options for a nice notifications'
author: 'myusufcse'
branding:
  icon: 'message-square'
  color: 'blue'
inputs:
  webhook:
    description: 'The webhook url for your Incoming Webhook connector'
    required: true
  message:
    description: 'The message you want to send to your Microsoft Teams channel'
    required: true
  notification_color:
    description: 'The notification color for your message either success, danger, warning or info'
    required: false
  button_link_text:
    description: 'The button text for navigation to link from Microsoft Teams channel'
    required: false
  button_link:
    description: 'The button link for navigation from Microsoft Teams channel'
    required: false
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.webhook }}
    - ${{ inputs.message }}
    - ${{ inputs.notification_color }}
    - ${{ inputs.button_link_text }}
    - ${{ inputs.button_link }}
