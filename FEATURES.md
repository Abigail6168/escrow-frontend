# Admin Page - Features Overview

## Visual Walkthrough

### 1. Disconnected State

```
┌─────────────────────────────────────────────┐
│ 🔐 Escrow         [Connect Wallet]          │
├─────────────────────────────────────────────┤
│                                             │
│    Token Whitelist Admin                    │
│    Manage whitelisted payment tokens        │
│                                             │
│    ⚠ Connect your wallet to manage          │
│       the whitelist.                        │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. Admin Verification Loading

```
┌─────────────────────────────────────────────┐
│ 🔐 Escrow   Dashboard  + New Job  [G12...] │
│                                   Disconnect│
├─────────────────────────────────────────────┤
│                                             │
│    Token Whitelist Admin                    │
│    Manage whitelisted payment tokens        │
│                                             │
│            ⟳  Verifying admin access...     │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Non-Admin Access Denied

```
┌─────────────────────────────────────────────┐
│ 🔐 Escrow   Dashboard  + New Job  [G45...] │
│                                   Disconnect│
├─────────────────────────────────────────────┤
│                                             │
│    Token Whitelist Admin                    │
│    Manage whitelisted payment tokens        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │             🔒                       │   │
│  │                                     │   │
│  │        Access Denied                │   │
│  │                                     │   │
│  │  This page is restricted to the     │   │
│  │  contract admin. Your wallet does   │   │
│  │  not have admin privileges.         │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### 4. Admin Interface - Empty State

```
┌─────────────────────────────────────────────┐
│ 🔐 Escrow  Dashboard  + New Job  Admin     │
│                              [GAD...] Disc. │
├─────────────────────────────────────────────┤
│                                             │
│    Token Whitelist Admin                    │
│    Manage whitelisted payment tokens        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ C...                          │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [    Add to Whitelist    ]        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Whitelisted Tokens                 │   │
│  │                                     │   │
│  │  No whitelisted tokens found.       │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### 5. Admin Interface - With Tokens

```
┌─────────────────────────────────────────────┐
│ 🔐 Escrow  Dashboard  + New Job  Admin     │
│                              [GAD...] Disc. │
├─────────────────────────────────────────────┤
│                                             │
│    Token Whitelist Admin                    │
│    Manage whitelisted payment tokens        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789...                  │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [    Add to Whitelist    ]        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Whitelisted Tokens                 │   │
│  │                                     │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN123ABC...    [Remove]   │  │   │
│  │  └───────────────────────────────┘  │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN456DEF...    [Remove]   │  │   │
│  │  └───────────────────────────────┘  │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789GHI...    [Remove]   │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### 6. Adding Token - Building Transaction

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789...                  │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [⟳  Preparing...           ]      │   │
│  └─────────────────────────────────────┘   │
```

### 7. Adding Token - Signing

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789...                  │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [⟳  Sign in wallet...      ]      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Freighter popup shown separately]        │
```

### 8. Adding Token - Submitting

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789...                  │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [⟳  Submitting...          ]      │   │
│  └─────────────────────────────────────┘   │
```

### 9. Success State

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │                               │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [    Add to Whitelist    ]        │   │
│  │                                     │   │
│  │  ✅ Token added to whitelist        │   │
│  │     successfully.                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Whitelisted Tokens                 │   │
│  │                                     │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789... (NEW)  [Remove]  │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
```

### 10. Error State

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐   │
│  │  Add Token                          │   │
│  │                                     │   │
│  │  Token Contract Address             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN789...                  │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  [    Add to Whitelist    ]        │   │
│  │                                     │   │
│  │  ❌ You declined the transaction    │   │
│  │     in your wallet.                 │   │
│  └─────────────────────────────────────┘   │
```

### 11. Removing Token

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐   │
│  │  Whitelisted Tokens                 │   │
│  │                                     │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN123...  [⟳ Submitting...]│  │   │
│  │  └───────────────────────────────┘  │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ CTOKEN456DEF...    [Remove]   │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
```

## Features Summary

### Access Control

✅ Only admin sees "Admin" link in navbar  
✅ Loading spinner during verification  
✅ Clear "Access Denied" for non-admins  
✅ Graceful handling of disconnected wallets

### Token Management

✅ View all whitelisted tokens  
✅ Add new tokens with validation  
✅ Remove existing tokens  
✅ Empty state messaging  
✅ Auto-refresh after changes

### User Experience

✅ Real-time loading indicators  
✅ Phase-based progress (Build → Sign → Submit)  
✅ Success banners with clear messages  
✅ Descriptive error messages  
✅ Form clears after success  
✅ Disabled states during operations

### Design

✅ Consistent with app styling  
✅ Dark theme (gray-950 background)  
✅ Indigo accent color  
✅ Rounded borders and cards  
✅ Proper spacing and typography  
✅ Mobile responsive

### Technical

✅ TypeScript type safety  
✅ React hooks for state  
✅ Async/await patterns  
✅ AbortController for cleanup  
✅ Reusable utilities  
✅ Comprehensive tests

## Component Hierarchy

```
AdminPage
├── Navbar (conditional Admin link)
├── Page Header
│   ├── Title
│   └── Description
└── Main Content
    ├── Not Connected → Prompt
    ├── Checking Admin → Spinner
    ├── Not Admin → Access Denied
    └── Is Admin → Admin Interface
        ├── Add Token Form
        │   ├── Label + Input
        │   ├── Add Button
        │   └── TxStatusBanner
        └── Token List Section
            ├── Section Header
            └── Token Items
                ├── Token Address
                ├── Remove Button
                └── TxStatusBanner
```

## State Management

### Component State

- `tokenAddress` - Input value for adding token
- `whitelist` - Array of whitelisted tokens
- `listLoading` - Loading whitelist data
- `listError` - Error loading whitelist

### Hook State (useIsAdmin)

- `loading` - Checking admin status
- `isAdminUser` - Boolean admin flag

### Hook State (useActionStates)

- Per-action states with keys:
  - `add-token` - Adding token state
  - `remove-{address}` - Removing specific token state

Each action state has:

- `phase` - Transaction phase
- `error` - Error message
- `txHash` - Transaction hash

## User Flows

### Happy Path: Add Token

1. Admin connects wallet
2. Navbar shows "Admin" link
3. Click "Admin" → Page loads
4. See current whitelist
5. Enter token address
6. Click "Add to Whitelist"
7. Approve in Freighter
8. See success message
9. Token appears in list

### Happy Path: Remove Token

1. Admin on admin page
2. See whitelisted tokens
3. Click "Remove" on a token
4. Approve in Freighter
5. See success message
6. Token disappears from list

### Error Path: Non-Admin

1. User connects wallet
2. No "Admin" link appears
3. If they go to /admin directly
4. See "Access Denied" screen
5. Cannot perform any actions

### Error Path: Transaction Declined

1. Admin initiates add/remove
2. Freighter shows transaction
3. User clicks "Reject"
4. Error banner shows
5. Can retry immediately

## Mobile Responsive Behavior

### Desktop (> 768px)

- Max width 768px (max-w-xl)
- Centered layout
- All elements visible
- Hover states active

### Mobile (< 768px)

- Full width with padding
- Token addresses truncate
- Buttons stack if needed
- 44px touch targets
- No overflow scrolling

## Accessibility Features

### Keyboard Navigation

- All buttons focusable
- Focus rings visible
- Logical tab order
- Enter key submits form

### Screen Readers

- Semantic HTML structure
- ARIA labels on buttons
- Role="alert" for errors
- Descriptive loading text

### Visual

- High contrast text
- Clear error colors
- Loading indicators
- Disabled states obvious

## Browser Compatibility

Tested/Compatible:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requirements:

- JavaScript enabled
- Freighter wallet extension
- Modern browser (ES2020+)

## Performance

- ✅ Minimal re-renders (React hooks)
- ✅ Lazy loading (Next.js)
- ✅ AbortController for cleanup
- ✅ Memoized callbacks
- ✅ No unnecessary state updates

## Security

- ✅ No stored credentials
- ✅ Wallet signature required
- ✅ Contract-level validation
- ✅ Backend verification needed
- ✅ No XSS vulnerabilities
- ✅ No hardcoded secrets

---

**Status**: ✅ Complete and production-ready
**Version**: 1.0.0
**Last Updated**: 2026-06-28
