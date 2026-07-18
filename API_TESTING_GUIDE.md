# 🚀 Complete Waffle Berry API Testing Guide

## ✅ **What We Just Built**

A **complete end-to-end voice cloning workflow** with these endpoints:

### **3-Step Voice Cloning Process:**

```
STEP 1: Create User
   ↓
STEP 2: Create Voice Profile (e.g., "Mom", "Dad")
   ↓
STEP 3: Upload Voice Samples (audio files for training)
   ↓
STEP 4: Start Conversation (chat using cloned voice)
```

---

## 🔧 **Setup Instructions**

### 1. **Install New Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### 2. **Run the Server**
```bash
python run.py
```

You should see:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 3. **Open Swagger UI**
Visit: **http://localhost:8000/docs**

You'll see all API endpoints with interactive testing!

---

## 📝 **Complete Testing Workflow**

### **Test #1: Create a User**

**Endpoint:** `POST /api/v1/users`

**In Swagger UI:**
1. Find "POST /api/v1/users"
2. Click "Try it out"
3. Enter this JSON:

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

4. Click "Execute"

**Expected Response (201 Created):**
```json
{
  "user_id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00"
}
```

✅ **User created successfully!**

---

### **Test #2: Create a Voice Profile**

**Endpoint:** `POST /api/v1/voice-profiles`

This is where you tell the system: "I want to clone Mom's voice"

**In Swagger UI:**
1. Find "POST /api/v1/voice-profiles"
2. Click "Try it out"
3. Add query parameter: `user_id=1` (the user we just created)
4. Enter this JSON body:

```json
{
  "voice_name": "Mom",
  "relationship": "Mother",
  "language": "English",
  "accent": "Indian English"
}
```

5. Click "Execute"

**Expected Response (201 Created):**
```json
{
  "voice_profile_id": 1,
  "user_id": 1,
  "voice_name": "Mom",
  "relationship": "Mother",
  "language": "English",
  "accent": "Indian English",
  "training_status": "pending",
  "model_path": null,
  "created_at": "2024-01-15T10:35:00",
  "updated_at": "2024-01-15T10:35:00"
}
```

✅ **Voice profile created! Status = "pending"** (waiting for voice samples)

---

### **Test #3: Upload Voice Samples**

**Endpoint:** `POST /api/v1/voice-profiles/{voice_profile_id}/samples`

This is where you upload recordings of "Mom's" voice for training.

**In Swagger UI:**
1. Find "POST /api/v1/voice-profiles/{voice_profile_id}/samples"
2. Click "Try it out"
3. Set path parameter: `voice_profile_id=1`
4. Enter this JSON body:

```json
{
  "file_path": "/uploads/mom_voice_sample_1.wav",
  "file_name": "mom_voice_sample_1.wav",
  "duration_seconds": 45,
  "file_size_mb": 5
}
```

5. Click "Execute"

**Expected Response (201 Created):**
```json
{
  "sample_id": 1,
  "voice_profile_id": 1,
  "file_path": "/uploads/mom_voice_sample_1.wav",
  "file_name": "mom_voice_sample_1.wav",
  "duration_seconds": 45,
  "file_size_mb": 5,
  "uploaded_at": "2024-01-15T10:40:00"
}
```

✅ **Voice sample uploaded!**

**Upload More Samples:**
Repeat the same request 2-3 more times with different file paths:

```json
{
  "file_path": "/uploads/mom_voice_sample_2.wav",
  "file_name": "mom_voice_sample_2.wav",
  "duration_seconds": 60,
  "file_size_mb": 6
}
```

The more samples = better voice cloning! 🎯

---

### **Test #4: Get All Voice Samples**

**Endpoint:** `GET /api/v1/voice-profiles/{voice_profile_id}/samples`

**In Swagger UI:**
1. Find "GET /api/v1/voice-profiles/{voice_profile_id}/samples"
2. Click "Try it out"
3. Set `voice_profile_id=1`
4. Click "Execute"

**Response:**
```json
[
  {
    "sample_id": 1,
    "voice_profile_id": 1,
    "file_path": "/uploads/mom_voice_sample_1.wav",
    "file_name": "mom_voice_sample_1.wav",
    "duration_seconds": 45,
    "file_size_mb": 5,
    "uploaded_at": "2024-01-15T10:40:00"
  },
  {
    "sample_id": 2,
    "voice_profile_id": 1,
    "file_path": "/uploads/mom_voice_sample_2.wav",
    "file_name": "mom_voice_sample_2.wav",
    "duration_seconds": 60,
    "file_size_mb": 6,
    "uploaded_at": "2024-01-15T10:45:00"
  }
]
```

✅ **All samples retrieved!**

---

### **Test #5: Start a Conversation**

**Endpoint:** `POST /api/v1/conversations`

Now that we have voice samples, let's start chatting!

**In Swagger UI:**
1. Find "POST /api/v1/conversations"
2. Click "Try it out"
3. Add query parameter: `user_id=1`
4. Enter this JSON body:

```json
{
  "voice_profile_id": 1
}
```

5. Click "Execute"

**Expected Response (201 Created):**
```json
{
  "conversation_id": 1,
  "user_id": 1,
  "voice_profile_id": 1,
  "started_at": "2024-01-15T10:50:00",
  "updated_at": "2024-01-15T10:50:00"
}
```

✅ **Conversation started!**

---

### **Test #6: Send a Message**

**Endpoint:** `POST /api/v1/conversations/{conversation_id}/messages`

This is where you ask the AI (speaking as "Mom")!

**In Swagger UI:**
1. Find "POST /api/v1/conversations/{conversation_id}/messages"
2. Click "Try it out"
3. Set `conversation_id=1`
4. Enter this JSON body:

```json
{
  "message_text": "Mom, what should I eat for lunch today?"
}
```

5. Click "Execute"

**Expected Response (201 Created):**
```json
{
  "message_id": 1,
  "conversation_id": 1,
  "sender": "user",
  "message_text": "Mom, what should I eat for lunch today?",
  "audio_path": null,
  "sent_at": "2024-01-15T10:52:00"
}
```

✅ **Message sent!**

---

### **Test #7: Get All Messages**

**Endpoint:** `GET /api/v1/conversations/{conversation_id}/messages`

**In Swagger UI:**
1. Find "GET /api/v1/conversations/{conversation_id}/messages"
2. Click "Try it out"
3. Set `conversation_id=1`
4. Click "Execute"

**Response:**
```json
[
  {
    "message_id": 1,
    "conversation_id": 1,
    "sender": "user",
    "message_text": "Mom, what should I eat for lunch today?",
    "audio_path": null,
    "sent_at": "2024-01-15T10:52:00"
  }
]
```

✅ **Messages retrieved!**

---

### **Test #8: Get User's Voice Profiles**

**Endpoint:** `GET /api/v1/users/{user_id}/voice-profiles`

See all cloned voices a user has created.

**In Swagger UI:**
1. Find "GET /api/v1/users/{user_id}/voice-profiles"
2. Click "Try it out"
3. Set `user_id=1`
4. Click "Execute"

**Response:**
```json
[
  {
    "voice_profile_id": 1,
    "user_id": 1,
    "voice_name": "Mom",
    "relationship": "Mother",
    "language": "English",
    "accent": "Indian English",
    "training_status": "pending",
    "model_path": null,
    "created_at": "2024-01-15T10:35:00",
    "updated_at": "2024-01-15T10:35:00"
  }
]
```

✅ **User's voices retrieved!**

---

### **Test #9: Get User's Conversations**

**Endpoint:** `GET /api/v1/users/{user_id}/conversations`

**In Swagger UI:**
1. Find "GET /api/v1/users/{user_id}/conversations"
2. Click "Try it out"
3. Set `user_id=1`
4. Click "Execute"

**Response:**
```json
[
  {
    "conversation_id": 1,
    "user_id": 1,
    "voice_profile_id": 1,
    "started_at": "2024-01-15T10:50:00",
    "updated_at": "2024-01-15T10:50:00"
  }
]
```

✅ **User's conversations retrieved!**

---

## 🗄️ **Database Schema (What's Happening Behind the Scenes)**

```
USERS TABLE (1 record)
├── user_id: 1
├── full_name: John Doe
├── email: john@example.com
└── password_hash: [encrypted]

VOICE_PROFILES TABLE (1 record)
├── voice_profile_id: 1
├── user_id: 1 (links to user)
├── voice_name: Mom
├── relationship: Mother
├── training_status: pending
└── language: English

VOICE_SAMPLES TABLE (3 records)
├── sample_id: 1
├── voice_profile_id: 1 (links to voice profile)
├── file_path: /uploads/mom_voice_sample_1.wav
└── duration_seconds: 45

[Similar records for sample_id 2, 3...]

CONVERSATIONS TABLE (1 record)
├── conversation_id: 1
├── user_id: 1 (links to user)
└── voice_profile_id: 1 (links to voice profile)

MESSAGES TABLE (1+ records)
├── message_id: 1
├── conversation_id: 1 (links to conversation)
├── sender: user
└── message_text: Mom, what should I eat for lunch today?
```

---

## 🎯 **Complete Flow Summary**

```
1. User Signup (POST /api/v1/users)
        ↓
        Creates user in database
        ↓
2. Create Voice Profile (POST /api/v1/voice-profiles)
        ↓
        Creates "Mom" profile (status = pending)
        ↓
3. Upload Voice Samples (POST /api/v1/voice-profiles/{id}/samples)
        ↓
        Stores 3-4 audio samples for training
        ↓
4. [AI Training Happens Here]
        ↓
        Model trains on samples
        training_status changes to "completed"
        ↓
5. Start Conversation (POST /api/v1/conversations)
        ↓
        Creates chat session
        ↓
6. Send Message (POST /api/v1/conversations/{id}/messages)
        ↓
        Message saved to database
        ↓
[AI Processing]
        ↓
        AI responds in "Mom's" voice
        AI message saved to database
        Audio generated and saved
        ↓
7. Get Messages (GET /api/v1/conversations/{id}/messages)
        ↓
        Retrieves all messages from conversation
```

---

## ✨ **What's Next?**

Now that the backend is working:

1. **Frontend Integration**: Update your frontend to call these APIs
2. **AI Integration**: Add OpenAI + Whisper + XTTS v2 to process messages
3. **File Uploads**: Implement proper audio file upload handling
4. **Authentication**: Add JWT tokens for security
5. **Error Handling**: Add better validation and error messages

---

## 🐛 **Common Testing Issues & Fixes**

### **Issue: 404 not found on GET requests**
- Make sure you're using the exact IDs from previous requests
- Example: If POST returns `user_id: 1`, use `1` in the URL

### **Issue: 400 bad request**
- Check your JSON format
- Make sure all required fields are included
- Validate field types (string vs number, etc.)

### **Issue: Database errors**
- Make sure `run.py` is still running
- Check that you activated the virtual environment
- Delete `waffle_berry.db` and restart to reset database

---

## 📚 **API Documentation**

Always available at: **http://localhost:8000/docs**

**Alternative documentation:** http://localhost:8000/redoc

---

## 🎉 **Success Checklist**

- ✅ User created successfully
- ✅ Voice profile created successfully
- ✅ Voice samples uploaded
- ✅ Conversation started
- ✅ Messages sent and retrieved
- ✅ Data persisted in SQLite database

**Congratulations! Your first complete API workflow is working!** 🚀
