import React, {} from "react";
import './style.scss';
import ButtonHelp from "../ButtonHelp";
import TextArea from "../TextArea";

function ShowTemplate({payload}) {

    return (<div className='div-showTemplate'>

        <p><b>TITLE:</b></p>
        <blockquote>
            <p>{payload.title}</p>
        </blockquote>
        <p><b>TEXT:</b></p>
        <blockquote>
            <p>{payload.text}</p>
        </blockquote>
        <p><b>BLOCKS:</b>
            <ButtonHelp onClick={()=>{window.open('https://api.slack.com/tools/block-kit-builder?mode=message&blocks='
                + encodeURIComponent(JSON.stringify(payload.blocks)));}} children='Open in SLACK'
                        tooltipText='View template with Slack Block Kit Builder'/>
        </p>
        <TextArea
            className='textarea-forJSON'
            value={JSON.stringify(payload.blocks,null,"  ")}
            readOnly={true}
           />

    </div>);
}

export default ShowTemplate;
