---
'@makeswift/controls': patch
'@makeswift/runtime': patch
---

### New `Group` control

We are introducing a new control called `Group`, designed to be a more versatile replacement for the `Shape` control, which has been deprecated and will be removed in a future release.

The `Group` control offers an improved visual hierarchy for grouped controls when rendered in the Makeswift builder, along with new options for specifying the group label and preferred layout.

The `Group` control options are:

- `label?: string = "Group"`

  - The label for the group panel in the Makeswift builder. Defaults to `"Group"`.

- `preferredLayout?: Group.Layout.Inline | Group.Layout.Popover = Group.Layout.Popover`

  - The preferred layout for the group in the Makeswift builder. Note that the builder may override this preference to optimize the user experience. Possible values include:

    - `Group.Layout.Inline`: Renders the group properties within the parent panel, visually grouping them to reflect the hierarchy. This is the default if no explicit value is provided.

    - `Group.Layout.Popover`: Renders the group properties in a standalone popover panel.

- `props: Record<string, ControlDefinition>`

  - An object record defining the controls being grouped. This can include any of the Makeswift controls, including other groups. For example:

  ```typescript
  Group({
    props: {
      text: Color({ label: 'Text' }),
      background: Color({ label: 'Background' }),
      dismissable: Checkbox({ label: 'Can be dismissed?' }),
    },
  })
  ```

For full documentation, visit the [`Group` control reference page](https://docs.makeswift.com/developer/reference/controls/group).
