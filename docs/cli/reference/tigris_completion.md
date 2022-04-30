---
id: completion
title: Auto-completion for Shell
slug: /cli/completion
---

Generates completion script for shell

### Synopsis

Generates completion helper script for multiple shells

```
tigris completion [bash|zsh|fish|powershell]
```

### Examples

```

  # Bash

  $ source <(tigris completion bash)

  # To load completions for each session, execute once:
  # Linux:
  $ tigris completion bash > /etc/bash_completion.d/tigris
  # macOS:
  $ tigris completion bash > /usr/local/etc/bash_completion.d/tigris

  # Zsh

  # If shell completion is not already enabled in your environment,
  # you will need to enable it.  You can execute the following once:

  $ echo "autoload -U compinit; compinit" >> ~/.zshrc

  # To load completions for each session, execute once:
  $ tigris completion zsh > "${fpath[1]}/_tigris"

  # You will need to start a new shell for this setup to take effect.

  # fish

  $ tigris completion fish | source

  # To load completions for each session, execute once:
  $ tigris completion fish > ~/.config/fish/completions/tigris.fish

  # PowerShell

  PS> tigris completion powershell | Out-String | Invoke-Expression

  # To load completions for every new session, run:
  PS> tigris completion powershell > tigris.ps1
  # and source this file from your PowerShell profile.

```

### Options

```
  -h, --help   help for completion
```
