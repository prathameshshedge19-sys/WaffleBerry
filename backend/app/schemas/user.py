"""Pydantic schemas for Voice Profiles."""

from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional


# ==================== USER SCHEMAS ====================

class UserBase(BaseModel):
    """Base user schema."""
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")


class UserResponse(UserBase):
    """Schema for user response."""
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== VOICE PROFILE SCHEMAS ====================

class VoiceProfileBase(BaseModel):
    """Base voice profile schema."""
    voice_name: str = Field(..., min_length=1, max_length=255, description="Name of the voice (e.g., Mom, Dad)")
    relationship: str = Field(..., min_length=1, max_length=100, description="Relationship with voice owner")
    language: str = Field(default="English", max_length=50)
    accent: str = Field(default="Standard", max_length=100)


class VoiceProfileCreate(VoiceProfileBase):
    """Schema for creating a voice profile."""
    pass


class VoiceProfileUpdate(BaseModel):
    """Schema for updating a voice profile."""
    voice_name: Optional[str] = Field(None, min_length=1, max_length=255)
    relationship: Optional[str] = Field(None, min_length=1, max_length=100)
    language: Optional[str] = Field(None, max_length=50)
    accent: Optional[str] = Field(None, max_length=100)


class VoiceProfileResponse(VoiceProfileBase):
    """Schema for voice profile response."""
    voice_profile_id: int
    user_id: int
    training_status: str
    model_path: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== VOICE SAMPLE SCHEMAS ====================

class VoiceSampleBase(BaseModel):
    """Base voice sample schema."""
    file_name: str = Field(..., max_length=255)
    duration_seconds: int = Field(..., gt=0, description="Duration must be greater than 0")
    file_size_mb: int = Field(..., gt=0)


class VoiceSampleCreate(VoiceSampleBase):
    """Schema for creating a voice sample."""
    file_path: str


class VoiceSampleResponse(VoiceSampleBase):
    """Schema for voice sample response."""
    sample_id: int
    voice_profile_id: int
    file_path: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


# ==================== CONVERSATION SCHEMAS ====================

class ConversationCreate(BaseModel):
    """Schema for creating a conversation."""
    voice_profile_id: int


class ConversationResponse(BaseModel):
    """Schema for conversation response."""
    conversation_id: int
    user_id: int
    voice_profile_id: int
    started_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== MESSAGE SCHEMAS ====================

class MessageCreate(BaseModel):
    """Schema for creating a message."""
    message_text: str = Field(..., min_length=1, description="Message cannot be empty")


class MessageResponse(BaseModel):
    """Schema for message response."""
    message_id: int
    conversation_id: int
    sender: str
    message_text: str
    audio_path: Optional[str]
    sent_at: datetime
    
    class Config:
        from_attributes = True


# ==================== CONSENT SCHEMAS ====================

class ConsentCreate(BaseModel):
    """Schema for consent."""
    consent_given: bool
    consent_document_path: Optional[str] = None


class ConsentResponse(BaseModel):
    """Schema for consent response."""
    consent_id: int
    voice_profile_id: int
    consent_given: bool
    consent_date: datetime
    
    class Config:
        from_attributes = True


# ==================== USER SETTINGS SCHEMAS ====================

class UserSettingsCreate(BaseModel):
    """Schema for user settings."""
    theme: str = Field(default="light", pattern="^(light|dark)$")
    language: str = Field(default="English")
    speech_speed: str = Field(default="normal", pattern="^(slow|normal|fast)$")
    ai_personality: str = Field(default="friendly")


class UserSettingsResponse(UserSettingsCreate):
    """Schema for user settings response."""
    setting_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
