from langchain.agents import create_agent 
from app.services.llm import llm
from app.prompts.system_prompt import BUSINESS_SYSTEM_PROMPT, DETECTION_SYSTEM_PROMPT, ROUTER_SYSTEM_PROMPT, SOCIAL_SYSTEM_PROMPT, REWRITE_SYSTEM_PROMPT, ORDER_EXTRACTION_SYSTEM_PROMPT

business_agent = create_agent(
    model=llm,
    tools=[],
    system_prompt=BUSINESS_SYSTEM_PROMPT,
)

detection_agent = create_agent(
    model=llm,
    tools=[],
    system_prompt=DETECTION_SYSTEM_PROMPT,
)

router_agent = create_agent(
    model=llm,
    tools=[],
    system_prompt=ROUTER_SYSTEM_PROMPT
)

social_agent = create_agent(
    model=llm,
    tools=[],
    system_prompt=SOCIAL_SYSTEM_PROMPT,
)

rewrite_agent = create_agent(
    model=llm,
    tools=[],
    system_prompt=REWRITE_SYSTEM_PROMPT
)

order_agent = create_agent(
    model=llm, 
    tools=[], 
    system_prompt=ORDER_EXTRACTION_SYSTEM_PROMPT
)