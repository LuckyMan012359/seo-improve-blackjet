# Black Jet React Website

### Setup 
- `npm i`
- Create a `.env` file
```JS
REACT_APP_API_URL=https://BLACKJET_URI_URI
REACT_APP_SOCKET_URL=https://BLACKJET_URI_URI

REACT_APP_BLACKJET_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=com.twitter.android
REACT_APP_BLACKJET_APPSTORE_URL=https://apps.apple.com/in/app/x/id333903271
```

## Branches

"__master__" branch is the main branch used for development  
"__production__" branch is for production code (and has restrictions in place)

## Style Guide

All code in this repository shall use [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript) 


# Branch Naming Conventions

This document outlines the branch naming conventions for our project to ensure clear communication, efficient collaboration, and easy tracking of changes.

**Benefits of Consistent Branch Naming:**

* **Improved Clarity:** Descriptive branch names readily identify the purpose of ongoing work.
* **Enhanced Collaboration:** Consistent naming allows team members to quickly understand what others are working on.
* **Streamlined Change Tracking:** Branch names serve as a historical record, simplifying codebase navigation.

**Branch Naming Structure:**

We'll employ a prefix-based naming convention, where the prefix indicates with task/bug id the type of branch and is followed by a descriptive name:

**Prefix | Description**
---|---|
`F_BUG_ID` | Feature branches: Used for developing new features.
`B_BUG_ID` | Bugfix branches: Address identified bugs or issues.
`I_BUG_ID` | Improvement branches: Implement enhancements or optimizations.
`U_BUG_ID` | Update branches: Apply non-breaking changes to code or documentation.
`H_BUG_ID` | Hotfix branches: Fix critical issues requiring immediate deployment.
`R_BUG_ID` | Release branches: Prepare specific code versions for release.
`T_BUG_ID` | Testing branches: Isolate code for dedicated testing purposes.
`M_BUG_ID` | Maintenance branches: Handle tasks like dependency updates or infrastructure changes.

**Additional Considerations:**

* **Descriptive Names:** Use clear and concise names that accurately reflect the branch's purpose.
* **Hyphens (-):** Separate words within the descriptive name.
* **Lowercase:** Maintain consistency by using lowercase characters throughout the branch name.
* **Issue Tracking:** If your project uses an issue tracker, consider incorporating issue IDs (e.g., `F_BPM_67_new-login-feature`).
* **Dates:** While dates can be helpful, use them sparingly to avoid cluttering names. Consider a separate system for tracking branch creation timestamps.

**Examples:**

* `F_login-enhancements` - Develops improvements to the login functionality.
* `B_navigation-bugfix` - Addresses a bug in the navigation component.
* `I_performance-optimization` - Implements optimizations to enhance application performance.
* `U_README-update` - Updates the README file.
* `H_security-patch` - Applies a critical security patch.
* `R_v1.2.0` - Prepares the codebase for version 1.2.0 release.
* `T_integration-testing` - Isolates specific code for integration testing.


**Enforcing Conventions:**

* Team communication: Discuss and agree upon conventions clearly.
* Linting tools: Consider utilizing tools that enforce branch naming rules.
* Version control hooks: Explore pre-commit hooks to prevent non-compliant branch naming.

**Conclusion:**

By adhering to this branch naming convention, we can foster a well-organized and collaborative development environment. Remember to adapt and personalize this convention to your project's specific needs.

##
# Commit Message Convention
This document outlines the conventions for writing clear and informative commit messages in our project. Effective commit messages improve codebase readability, collaboration, and version control history.

**Structure:**

We'll adopt a format consisting of a concise prefix followed by a descriptive message:

**Prefix | Description**
---|---|
`UI:` | Changes related to the user interface (UI).
`FEAT:` | Introduction of new features or functionalities.
`FIX:` | Fixes for identified bugs or issues.
`ADDED:` | Addition of new code, files, or functionalities.
`REMOVED:` | Removal of code, files, or functionalities (use with caution).
`REFACTOR:` | Code improvements that don't introduce new features or break existing functionality.
`DOCS:` | Modifications to documentation.
`TESTS:` | Additions or changes to test cases.
`OTHER:` | Use for miscellaneous changes that don't fit the above categories.

**Content:**

* **Prefix:** Use a single, relevant prefix from the table above.
* **Description:** Keep it concise (ideally under 50 characters) and descriptive.
* **Imperative Mood:** Use the imperative mood (e.g., "Added support for dark mode").
* **Capitalization:** Capitalize the first letter of the description only.
* **Issue IDs:** If applicable, reference related issues (e.g., "Fixes #123: Login form validation error").

**Examples:**

* `UI: Updated button styles for better responsiveness`
* `FEAT: Implemented drag-and-drop functionality`
* `FIX: Resolved navigation menu display issue on mobile devices`
* `ADDED: New API endpoint for user data retrieval`
* `REFACTOR: Improved code readability for the search functionality`
* `DOCS: Updated installation instructions in README.md`
* `TESTS: Added integration tests for the payment processing module`

**Additional Tips:**

* Break longer messages into a body section for complex changes.
* Use clear and concise language that conveys the message effectively.
* Maintain consistency in your commit messages over time.


By adhering to these guidelines, we can ensure commit messages provide valuable context and clarity within our version control history.
