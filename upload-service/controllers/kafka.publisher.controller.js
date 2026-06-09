import KafkaConfig from "../kafka/kafka.js";

export const pushVideoForEncodingToKafka = async (title,url) => {
    try {
        const message = {
            "title":title,
            "url":url   
        };
        console.log("Message: ", message);
        const kafkaconfig = new KafkaConfig();
        const msgs = [
            {
                key: "key1",
                value: JSON.stringify(message)
            }
        ]
        const result = await kafkaconfig.produce("transcode", msgs);
        console.log("Result of produce", result);
        res.status(200).json({ "message": "Message uploaded successfully" });
    } catch (error) {
        console.log(error);


    }

}