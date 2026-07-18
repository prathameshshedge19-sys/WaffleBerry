"""SQLAlchemy ORM models for Waffle Berry."""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from datetime import datetime
from app.db import Base
import enum


class User(Base):
    """User model - stores registered users."""
    
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, email={self.email})>"


class TrainingStatus(str, enum.Enum):
    """Training status enum."""
    PENDING = "pending"
    TRAINING = "training"
    COMPLETED = "completed"
    FAILED = "failed"


class VoiceProfile(Base):
    """Voice Profile model - stores cloned voices."""
    
    __tablename__ = "voice_profiles"
    
    voice_profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    voice_name = Column(String(255), nullable=False)
    relationship = Column(String(100), nullable=False)
    language = Column(String(50), default="English")
    accent = Column(String(100), default="Standard")
    training_status = Column(String(20), default="pending")
    model_path = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<VoiceProfile(voice_profile_id={self.voice_profile_id}, voice_name={self.voice_name})>"


class VoiceSample(Base):
    """Voice Sample model - uploaded audio files for training."""
    
    __tablename__ = "voice_samples"
    
    sample_id = Column(Integer, primary_key=True, index=True)
    voice_profile_id = Column(Integer, nullable=False, index=True)
    file_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    file_size_mb = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<VoiceSample(sample_id={self.sample_id}, voice_profile_id={self.voice_profile_id})>"


class Conversation(Base):
    """Conversation model - chat sessions with cloned voices."""
    
    __tablename__ = "conversations"
    
    conversation_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    voice_profile_id = Column(Integer, nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Conversation(conversation_id={self.conversation_id})>"


class Message(Base):
    """Message model - individual messages in conversations."""
    
    __tablename__ = "messages"
    
    message_id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, nullable=False, index=True)
    sender = Column(String(50), nullable=False)  # "user" or "ai"
    message_text = Column(Text, nullable=False)
    audio_path = Column(String(500), nullable=True)  # For AI-generated audio
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Message(message_id={self.message_id}, sender={self.sender})>"


class Consent(Base):
    """Consent model - proof of permission for voice cloning."""
    
    __tablename__ = "consent"
    
    consent_id = Column(Integer, primary_key=True, index=True)
    voice_profile_id = Column(Integer, nullable=False, index=True)
    consent_given = Column(Boolean, default=False)
    consent_date = Column(DateTime(timezone=True), server_default=func.now())
    consent_document_path = Column(String(500), nullable=True)
    
    def __repr__(self):
        return f"<Consent(consent_id={self.consent_id})>"


class UserSettings(Base):
    """User Settings model - user preferences."""
    
    __tablename__ = "user_settings"
    
    setting_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True, unique=True)
    theme = Column(String(20), default="light")  # light, dark
    language = Column(String(50), default="English")
    speech_speed = Column(String(20), default="normal")  # slow, normal, fast
    ai_personality = Column(String(50), default="friendly")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<UserSettings(setting_id={self.setting_id})>"
