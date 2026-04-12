---
title: "Excel + Power Automate: Get Email Notifications When Your Shared File Changes (No Premium License)"
pubDatetime: 2026-04-12T00:00:00Z
modDatetime: 2026-04-12T00:00:00Z
slug: excel-powerautomate-notification
featured: true
draft: false
ogImage: https://essalemy.com/assets/excel-powerautomate-og.jpg
author: "Mohamed Es-salemy"
tags:
  - Power Automate
  - Automation

description: "Learn how to build a zero-cost automated notification system that sends an email every time something happens in your shared Excel file — using VBA, SharePoint REST API, and Power Automate with only an O365 license."
---

## Demo Video

<iframe
  width="100%"
  style="aspect-ratio: 16/9;"
  src="https://www.youtube.com/embed/ISczlCit3y4"
  title="Get Email Notifications When Your Shared File Changes"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

---

## The Business Problem

In many organizations, Excel files are still the backbone of day-to-day data collection — shared across teams, edited by multiple users, and expected to stay up to date.

The challenge: **how do you know when something changes?**

You either keep refreshing the file manually, or you rely on someone to tell you. Neither is reliable, and neither scales.

Common scenarios where this becomes a real pain point:

- A shared order tracker updated by the sales team
- A project log where multiple contributors add progress entries
- A form-based Excel file collecting daily reports from field teams
- Any file where **you are waiting for an update** before taking action

The goal is simple: the moment something happens in the file — a button is clicked, a row is added, a form is submitted — **you receive an email automatically.**

---

## Why This Approach

Most notification solutions for Excel either require:

- Power Automate **Premium** connectors (paid)
- Microsoft 365 Business Premium or higher plans
- Complex IT setup or admin permissions

This solution works with a **standard O365 license** only — no premium connectors, no extra cost.

The architecture relies on three components that are already available to you:

| Component           | Role                             |
| ------------------- | -------------------------------- |
| **Excel VBA**       | Detects the event and sends data |
| **SharePoint List** | Acts as the trigger point        |
| **Power Automate**  | Listens and sends the email      |

The SharePoint List connector in Power Automate is available on standard O365 plans, which makes this entire flow free to run.

---

## Important Constraint: Open the File from SharePoint / OneDrive

Before anything else, one critical requirement:

> **The Excel file must be opened directly from SharePoint or OneDrive — not downloaded locally.**

This is not a minor detail. When the file is opened locally, VBA cannot authenticate against your SharePoint tenant to call the REST API. The HTTP request will fail with an authentication error.

**The correct way to open the file:**

1. Go to your SharePoint site or OneDrive
2. Navigate to the file
3. Click **Open in Desktop App** (not Download)

When opened this way, Excel inherits your Microsoft 365 session credentials, and VBA can authenticate automatically using `WinHttpRequest` without any extra login step.

---

## How the Flow Works

```
[Excel Event Triggered]
        ↓
        ↓
[VBA Sends HTTP POST]
        ↓
        ↓
[SharePoint List: New Item Added]
        ↓
        ↓
[Power Automate: "When an item is created" trigger fires]
        ↓
        ↓
[Email sent to you with custom body]
```

The flow is entirely event-driven. Once set up, it requires zero manual intervention.

---

## Step 1 — Create the SharePoint List

In your SharePoint site, create a new list. For this guide, we'll call it **Notifications**.

Add the columns you want to capture. At minimum:

- **Title** — the event name or description
- **Body** — additional context or message

You can add more columns later (like a file URL, user name, timestamp, etc.) — but keep it minimal to start.

---

## Step 2 — Add the VBA Module to Your Workbook

Open your Excel file from SharePoint (see constraint above), then open the VBA editor with `Alt + F8` → **Macros** → or directly via `Alt + F11`.

Insert a new **Module** and paste the following reusable code:

```vb
' ================================================================
' MODULE: SharePoint REST Notifier
' ================================================================
Option Explicit

' ================================================================
' Defined Types — must be declared before any procedures.
' SPColumn holds one column internal name + its value.
' ================================================================
Private Type SPColumn
    Name  As String
    Value As String
End Type


' ================================================================
' CONFIGURATION
' ================================================================
Private Const SP_SITE_URL  As String = "https://yourtenant.sharepoint.com/sites/YourSite"
Private Const SP_LIST_NAME As String = "NotificationList"


' ================================================================
' DefineColumns
' ----------------------------------------------------------------
' Populates the caller-owned cols() array with column mappings.
'
' HOW TO ADD / REMOVE COLUMNS:
'   1. In DefineColumns, resize the ReDim to match (0 To N-1).
'   2. Add/remove SetField lines — one per column.
' ================================================================
Private Sub DefineColumns(ByRef cols() As SPColumn)
    ReDim cols(0 To 2)             ' <-- only line to change when adding columns

    SetField cols, 0, "Title",   GetTitle()
    SetField cols, 1, "Body",    GetBody()
    SetField cols, 2, "FileUrl", GetFileURL()

    ' Add more columns here if needed:
    ' SetField cols, 3, "YourColumnName", YourValue()
End Sub


' ================================================================
' Data sources — edit these to read from your workbook.
' ================================================================
Private Function GetTitle() As String
    ' Example: ThisWorkbook.Sheets("Events").Range("B2").Value
    GetTitle = "Event title here"
End Function

Private Function GetBody() As String
    ' Example: build a summary from multiple cells
    GetBody = "Your event recap here"
End Function

Private Function GetFileURL() As String
    GetFileURL = ThisWorkbook.Path & "/" & ThisWorkbook.Name
End Function


' ================================================================
' SendNotification — call this from a button or trigger
' ================================================================
Sub SendNotification()
    Dim cols()  As SPColumn
    Dim success As Boolean

    DefineColumns cols
    success = PostToSharePointList(SP_SITE_URL, SP_LIST_NAME, cols)

    If success Then
        MsgBox "Notification sent successfully.", vbInformation, "SharePoint"
    Else
        MsgBox "Failed to send notification. Check the Immediate window for details.", _
               vbExclamation, "SharePoint"
    End If
End Sub


' ================================================================
' ENGINE — do not edit below this line
' ================================================================

Private Sub SetField( _
    ByRef cols() As SPColumn, _
    index As Integer, _
    colName As String, _
    colValue As String _
)
    cols(index).Name  = colName
    cols(index).Value = colValue
End Sub


Private Function PostToSharePointList( _
    siteURL  As String, _
    listName As String, _
    ByRef cols() As SPColumn _
) As Boolean

    On Error GoTo ErrorHandler

    Dim digest As String
    digest = GetFormDigest(siteURL)

    If digest = "" Then
        Debug.Print "PostToSharePointList: could not obtain Request Digest." & vbCrLf & _
                    "Make sure the file is opened from SharePoint / OneDrive."
        PostToSharePointList = False
        Exit Function
    End If

    Dim requestURL As String
    requestURL = siteURL & "/_api/web/lists/GetByTitle('" & listName & "')/items"

    Dim http As Object
    Set http = CreateObject("MSXML2.XMLHTTP.6.0")

    http.Open "POST", requestURL, False
    http.setRequestHeader "Accept",                      "application/json;odata=verbose"
    http.setRequestHeader "Content-Type",                "application/json;odata=verbose"
    http.setRequestHeader "X-RequestDigest",             digest
    http.setRequestHeader "X-FORMS_BASED_AUTH_ACCEPTED", "f"
    http.send BuildJsonPayload(listName, cols)

    If http.Status = 201 Then
        Debug.Print "Item created successfully in [" & listName & "]."
        PostToSharePointList = True
    Else
        Debug.Print "HTTP " & http.Status & vbCrLf & http.responseText
        PostToSharePointList = False
    End If

    Exit Function
ErrorHandler:
    Debug.Print "PostToSharePointList error: " & Err.Description
    PostToSharePointList = False
End Function


Private Function BuildJsonPayload( _
    listName As String, _
    ByRef cols() As SPColumn _
) As String

    Dim i       As Integer
    Dim payload As String

    payload = "{""__metadata"":{""type"":""SP.Data." & listName & "ListItem""}"

    For i = LBound(cols) To UBound(cols)
        payload = payload & _
                  ",""" & cols(i).Name & """:""" & EscapeJson(cols(i).Value) & """"
    Next i

    payload = payload & "}"
    BuildJsonPayload = payload
End Function


Private Function EscapeJson(s As String) As String
    s = Replace(s, "\",  "\\")
    s = Replace(s, """", "\""")
    EscapeJson = s
End Function


Private Function GetFormDigest(siteURL As String) As String
    On Error GoTo ErrorHandler

    Dim http As Object
    Set http = CreateObject("MSXML2.XMLHTTP.6.0")

    http.Open "POST", siteURL & "/_api/contextinfo", False
    http.setRequestHeader "Accept",                      "application/json;odata=verbose"
    http.setRequestHeader "X-FORMS_BASED_AUTH_ACCEPTED", "f"
    http.send ""

    If http.Status = 200 Then
        GetFormDigest = ExtractJsonValue(http.responseText, "FormDigestValue")
    Else
        Debug.Print "GetFormDigest: HTTP " & http.Status
        GetFormDigest = ""
    End If

    Exit Function
ErrorHandler:
    Debug.Print "GetFormDigest error: " & Err.Description
    GetFormDigest = ""
End Function


Private Function ExtractJsonValue(json As String, fieldName As String) As String
    Dim searchKey As String
    Dim p1        As Long
    Dim p2        As Long

    searchKey = """" & fieldName & """:"""
    p1 = InStr(json, searchKey)

    If p1 = 0 Then ExtractJsonValue = "" : Exit Function

    p1 = p1 + Len(searchKey)
    p2 = InStr(p1, json, """")
    ExtractJsonValue = Mid(json, p1, p2 - p1)
End Function
```

### What to Configure

The module is split into a **configuration zone** (everything above the `ENGINE` divider) and an **engine zone** (everything below it). You only ever touch the configuration zone.

| What           | Where in the module                                        |
| -------------- | ---------------------------------------------------------- |
| `SP_SITE_URL`  | `Private Const` at the top — your SharePoint site URL      |
| `SP_LIST_NAME` | `Private Const` at the top — your list name                |
| `GetTitle()`   | Return the value you want in the **Title** column          |
| `GetBody()`    | Return the value you want in the **Body** column           |
| `GetFileURL()` | Returns the workbook path by default — customize if needed |

### Adding a New Column

Three things to do, all inside `DefineColumns`:

1. Increase the `ReDim` upper bound by 1 (e.g. `0 To 3` → `0 To 4`)
2. Add a new `SetField` line with the next index and your column's internal name
3. Make sure that column exists in your SharePoint list

```vb
' Example: adding a "Department" column
ReDim cols(0 To 3)
SetField cols, 3, "Department", "Engineering"
```

That's it — the engine handles the rest.

---

## Step 3 — Wire Up the Event Trigger in Excel

You can trigger `SendToSharePoint` from any Excel event. The most common ones:

### Option A — A Button Click

Assign a macro to a button (Insert → Shapes → Right-click → Assign Macro):

```vb
Sub OnSaveButtonClick()
    Call SendNotification()
End Sub
```

### Option B — A Cell Change

Use the `Worksheet_Change` event in the relevant sheet's code:

```vb
Private Sub Worksheet_Change(ByVal Target As Range)
    If Not Intersect(Target, Me.Range("B:B")) Is Nothing Then
        Call SendNotification()
    End If
End Sub
```

In both cases, `SendNotification` calls `DefineColumns` to collect the data and then fires the REST POST — no arguments needed at the call site.

---

## Step 4 — Create the Power Automate Flow

Go to [make.powerautomate.com](https://make.powerautomate.com) and create a new flow.

You can build it manually or use the AI prompt below to generate it instantly:

> **Copy and paste this prompt into Power Automate's "Describe it to design it" feature:**

```
Generate for me a flow under the name "Gmail Notification" that triggers
when an item is added to the SharePoint list "NotificationList" from the
site "https://yourtenant.sharepoint.com/sites/YourSite" then send an email
to Your Name (your@email.com) to notify him that new records were added.
```

Replace the site URL, list name, recipient name, and email address with your actual values before generating.

### Validate and Save the Flow

Once generated:

1. Review the three actions: **Trigger → Get Item → Send Email**
2. Accept the suggested connections (your O365 account)
3. Click **Save**

The flow is now live. Every new item added to your SharePoint list will trigger an email.

---

## End-to-End Test

1. Open the Excel file from SharePoint (not downloaded locally)
2. Click your button or make a change in the trigger cell
3. Check that a success message appears in Excel
4. Go to your SharePoint list — a new item should be visible
5. Check your inbox — the email should arrive within 1–2 minutes

---

## Recap: The Only Things You Need to Change

| Setting                    | Location                                     |
| -------------------------- | -------------------------------------------- |
| `SP_SITE_URL` constant     | Top of the VBA module                        |
| `SP_LIST_NAME` constant    | Top of the VBA module                        |
| `GetTitle()` / `GetBody()` | Data source functions — read from your sheet |
| SharePoint Site URL        | Power Automate flow trigger                  |
| SharePoint List Name       | Power Automate flow trigger                  |
| Recipient name & email     | Power Automate send email action             |

Everything else is reusable as-is.

---

## Why This Works Without a Premium License

The key is using the **SharePoint List** as the intermediary.

Power Automate's _"When an item is created"_ trigger for SharePoint is part of the **standard connector set**, included in every Microsoft 365 plan. There is no need for premium connectors, no Dataverse, no extra licensing.

VBA handles the write operation directly via the SharePoint REST API — which any authenticated Office session can access — so there is no need for a gateway or additional middleware either.

---

## Final Thoughts

This pattern — Excel VBA → SharePoint REST API → Power Automate → Email — is one of the most underrated automation setups in the Microsoft ecosystem.

It is:

- **Free** with any O365 license
- **Non-invasive** — no changes to your IT environment
- **Reusable** — the VBA module drops into any workbook
- **Extensible** — add more columns, more recipients, or branch the flow further

The full VBA module and setup guide are available in the GitHub repository linked below.

---

## Resources

- 📁 GitHub Repository: [github.com/MedEssalemy](https://github.com/MedEssalemy/VBA-Modules)
- 🎥 Video walkthrough: [youtube.com](https://www.youtube.com/watch?v=ISczlCit3y4)
- 🔧 Power Automate: [make.powerautomate.com](https://make.powerautomate.com)
- 📖 SharePoint REST API reference: [Microsoft Docs](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/get-to-know-the-sharepoint-rest-service)
