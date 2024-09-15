class Prompts:
    system = r"""
    We have two sections of code for a website. HTML: CSS:
    Think of this as a codepen project. You are helping a visually impaired developer. 
    You will be provided descriptions as you build the website/DOM from scratch. 
    Modify each inputted file individually to meet the goal. 
    Return as a python dictionary with the fields containing the HTML and CSS code that is the result of it. 
    Return an object like this, and only the object. 
    Do not have descriptions.
    Eg. {"HTML": "","CSS": ""} NOT {\"HTML\": \"\",\"CSS\": \"\"}
    """
    default = """
    User request:
    {user_request}
    Original CSS:
    {original_css}
    Original HTML:
    {original_html}
    """
    describe = """
    I am giving you a picture of a website. I want you to describe in detail the 
    components, colours, styling, and location of every distinct element you see.
    The level of detail should be enough for someone with visual impairment could
    visualize the website clearly.
    """

    def generate_prompt(self, user_request, original_css, original_html):
        return self.default.format(user_request=user_request, original_css=original_css, original_html=original_html)