from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess, os
from db import save_review 

app = FastAPI(title="CodeReview-AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = os.environ.get("REVIEW_MODEL", "codellama:7b-instruct")
PRO_LICENSE_KEY = "CRAI-PRO-2025"

class ReviewRequest(BaseModel):
    code: str
    mode: str
    diffOnly: bool | None = False
    style: str | None = None
@app.get("/api/test")
def test():
    return {"ok": True, "model": MODEL, "pro_key": PRO_LICENSE_KEY}

def run_ollama(prompt: str) -> str:
    res = subprocess.run(
        ["ollama", "run", MODEL],
        input=prompt,
        text=True,
        capture_output=True
    )
    return res.stdout if res.returncode == 0 else f"[LLM error] {res.stderr}"

PROMPT_FREE = """Give short helpful code review feedback in bullet points.

Code:
```
{code}
```
"""

PROMPT_PRO = """Give short helpful code review feedback.

Also include:
- unified diff patch (```diff block)
- rationale
- effort estimation: S / M / L AND approximate hours (example: M ≈ 4–6 hours)
- documentation update suggestions

Code:

```
{code}
```
"""

@app.post("/api/review")
async def review_code(req: ReviewRequest, x_license_key: str | None = Header(None)):
    pro = (x_license_key == PRO_LICENSE_KEY)

    if req.diffOnly:
        # incremental review prompt
        prompt = f"""Review ONLY the following diff patch.
Show only comments relevant to the changed lines.

Diff:
```
{req.code}
```
"""
    else:
        prompt = PROMPT_PRO.format(code=req.code) if pro else PROMPT_FREE.format(code=req.code)
        if req.style:
            prompt = f"You are reviewing code using style {req.style} guidelines.\n" + prompt

    if req.style:
        prompt += f"\n\nFollow style guideline: {req.style}\n"
    out = run_ollama(prompt)
    await save_review(req.code, out)
    return {"pro": pro, "review": out}

@app.post("/api/fix")
def auto_fix(req: ReviewRequest, x_license_key: str | None = Header(None)):
    pro = (x_license_key == PRO_LICENSE_KEY)
    if not pro:
        return {"patch": "Auto-fix available only for PRO"}

    prompt = f"""Given this code, produce a unified diff patch that fixes the code.
Only return the patch, nothing else.

Code:
```
{req.code}
```
"""

    out = run_ollama(prompt)
    return {"patch": out}

from db import create_thread

@app.post("/api/thread/new")
async def new_thread(title: str):
    id = await create_thread(title)
    return {"id": id}
