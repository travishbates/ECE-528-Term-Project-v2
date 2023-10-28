import {Button, Card, TextField} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import React, {BaseSyntheticEvent, useRef, useState} from "react";
import Chip from "@mui/material/Chip";
import {chatWithBot} from "./backendService";
import styles from "./Chat.module.css";

function Chat() {
    const chatInputRef = useRef()
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([]);

    function appendMessage(message, isBot) {
        setMessages((messages) => [...messages,
            {
                message,
                isBot
            }
        ])
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        appendMessage(chatInputRef.current.value, false);

        setLoading(true)

        chatWithBot(chatInputRef.current.value)
            .then((res) => {
                appendMessage(res, true);
                setLoading(false)
            })
    }

    return (
        <>
            <h1>Chat</h1>
            <Card className={styles.Card}>
                <CardContent>
                    <div className={styles.FlexContainer}>
                        {messages.map((message, index) =>
                            <>
                                <Chip
                                    className={styles.Chip}
                                    key={index}
                                    label={message.message}
                                    sx={{
                                        height: 'auto',
                                        '& .MuiChip-label': {
                                            display: 'block',
                                            whiteSpace: 'normal',
                                        },
                                        alignSelf: message.isBot ? 'flex-start' : 'flex-end',
                                        maxWidth: '300px'
                                    }}
                                />
                                <br/>
                            </>
                        )}
                    </div>
                    <div>
                        <form onSubmit={ handleSubmit }>
                            <TextField inputRef={chatInputRef} variant="outlined" />
                            <Button disabled={loading} className="w-100" type="submit">
                                Submit
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Chat