# Milestone 3.9 Authentication Test Results

Date: 2026-07-27

## Environment and method

- Live backend tested at `http://127.0.0.1:8000`.
- Frontend scripts tested directly with Node using isolated DOM, storage, fetch, navigation, and alert stubs.
- Frontend session verification was also exercised against the live `/api/v1/me` endpoint.
- Interactive in-app browser control was unavailable in this session. Browser-only actions are marked blocked; their underlying storage/navigation logic was covered by the automated harness.
- Unique test users were created because the backend has no user deletion endpoint.

## Results

| Test case | Expected result | Actual result | Status |
|---|---|---|---|
| Valid registration | HTTP 201 with safe user | User created; no password/hash returned | Pass |
| Registration frontend storage | No `accessToken` or `currentUser` | Neither key was stored | Pass |
| Registration authentication state | Registration alone is not authenticated | Protected guard redirected to login without calling `/me` | Pass |
| Duplicate email | HTTP 400 and useful error | `Email already registered` returned and displayed | Pass |
| Missing registration field | Rejected | Frontend blocked blank values; backend returned 422 | Pass |
| Invalid email | Rejected | Backend returned 422 | Pass |
| Short password | Rejected | Backend returned 422 | Pass |
| Valid login | HTTP 200 token response | JWT, `bearer`, and safe user returned | Pass |
| JWT subject | Token identifies authenticated user | `sub` matched the created user ID | Pass |
| Login storage | Store token and valid user JSON | Both values stored; no password stored | Pass |
| Wrong password | Generic HTTP 401 | 401 with `WWW-Authenticate: Bearer` | Pass |
| Unknown email | Same generic HTTP 401 | 401 with no email/password disclosure | Pass |
| Failed login with stale session | Clear old token and user | Initially failed; fixed and retested successfully | Pass after fix |
| Missing access token | Clear state and redirect | Cleared and redirected before `/me` | Pass |
| Empty access token | Clear state and redirect | Cleared and redirected | Pass |
| Missing current user | Clear state and redirect | Cleared and redirected | Pass |
| Malformed local user JSON | Clear state and redirect | Cleared and redirected | Pass |
| Fabricated local storage | Backend must reject | Live `/me` returned 401; frontend cleared and redirected | Pass |
| Valid `/me` | HTTP 200 matching token subject | Correct safe user returned | Pass |
| Missing Authorization | HTTP 401 with Bearer challenge | Correct generic 401 and header | Pass |
| Malformed auth scheme | HTTP 401 with Bearer challenge | Correct generic 401 and header | Pass |
| Random token | HTTP 401 with Bearer challenge | Correct generic 401 and header | Pass |
| Modified JWT payload | HTTP 401 | Correct generic 401 and header | Pass |
| Modified JWT signature | HTTP 401 | Correct generic 401 and header | Pass |
| Expired signed JWT | HTTP 401 | Correct generic 401 and header | Pass |
| Signed token for missing user | HTTP 401 | Correct generic 401 and header | Pass |
| `/me` request format | GET plus Bearer token | Exact URL, method, and header observed | Pass |
| `/me` 200 frontend handling | Refresh stored user | `currentUser` replaced with backend response | Pass |
| `/me` 401 frontend handling | Clear and redirect | Both keys removed; redirected | Pass |
| `/me` 403 frontend handling | Clear and redirect | Both keys removed; redirected | Pass |
| Malformed `/me` JSON | Clear and redirect | Both keys removed; redirected | Pass |
| Malformed `/me` user | Clear and redirect | Both keys removed; redirected | Pass |
| `/me` 500 | Preserve session and alert | Session preserved; temporary error shown | Pass |
| Backend offline | Preserve session and alert | Session preserved; exact two-line error shown | Pass |
| Logout from Home | Clear auth, preserve theme, redirect | Expected behavior observed | Pass |
| Logout from Chat | Clear auth, preserve theme, redirect | Expected behavior observed | Pass |
| Logout from Mission | Clear auth, preserve theme, redirect | Expected behavior observed | Pass |
| Protected page after logout | Redirect without backend request | Expected behavior observed for all three pages | Pass |
| Refresh with valid session | Reverify through `/me` | A fresh `/me` call occurred | Pass |
| Refresh with invalid token | Clear and redirect | Covered through fabricated-token live test | Pass |
| Close/reopen with stored session | Reverify through `/me` | New guard execution called `/me` | Pass |
| Browser Back after logout | Protected page rejects cleared state | Automated navigation-state equivalent passed | Pass (automated) |
| Interactive browser clicks/refresh/Back | Same behavior in a real browser UI | Browser-control runtime unavailable | Blocked |
| Google/Apple prototype buttons | Must not create authenticated storage | No auth keys created; protected guard rejects access | Pass |
| Login/register mode switching | UI state changes correctly | Register mode fields/text updated | Pass |
| Theme regression | Theme storage and switching still work | Theme key preserved and toggle passed | Pass |
| Home/chat/mission regression | Scripts and links remain intact | All JavaScript syntax checks and navigation/script checks passed | Pass (non-visual) |
| Password in local storage | None | No password key/value stored | Pass |
| JWT secret in frontend | None | No secret/config marker found | Pass |
| Backend `.env` tracking | Must remain untracked | Ignored and not tracked or staged | Pass |
| SQLite database tracking | Must not be staged or committed | Not staged, but already tracked; test registrations modified it | Fail |

## Defect fixed

### AUTH-001: Failed login retained stale authentication data

Reproduction before the fix:

1. Put valid `accessToken` and `currentUser` values in local storage.
2. Open the login page.
3. Submit a wrong password or unknown email.
4. Observe that both old values remain.

Cause: `js/login.js` displayed the login error but did not clear an older local session.

Fix: the login error path now removes `accessToken` and `currentUser` for login-mode failures only. Registration behavior is unchanged.

Retest: wrong-password and unknown-email attempts both cleared stale storage and retained the generic backend error.

## Unresolved issues

### SEC-001: SQLite database is already tracked

`WaffleBerry_backend/backend/waffle_berry.db` is tracked by Git. It is not staged, but live registration tests modified it. No Git tracking/history change was made during this milestone.

Suggested follow-up: decide whether development database files belong in source control, add the appropriate ignore rule, remove the file from tracking in a dedicated repository-hygiene change, and review committed database contents.

### ENV-001: Interactive browser pass is outstanding

The connected browser-control runtime was unavailable. Automated equivalents covered storage, refresh/reopen guard execution, logout, redirects, alerts, and live `/me` requests, but a human or connected-browser pass should still verify visual navigation, refresh, and Back-button behavior.

## Recommendation

The implemented authentication flow passes the live backend and automated frontend end-to-end checks after fixing AUTH-001. Milestone 3 authentication should not be declared fully complete until the interactive browser pass is performed and the tracked SQLite database issue is reviewed.
