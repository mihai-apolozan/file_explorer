from pydantic import BaseModel

class CreateRequest(BaseModel):
    path: str
    type: str

class RenameRequest(BaseModel):
    path: str
    newName: str

class WriteRequest(BaseModel):
    path: str
    content: str