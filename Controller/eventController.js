const events=require('../Model/eventSchema')

// add events
exports.addEvents=async(req,res)=>{
    console.log("inside the event add");
    const userId=req.payload
    const image=req.file.filename
    const{event,category,subcategory,name,description,date,time,location,price,seat}=req.body
    try {
       
        const parsedPrice = price.split(',').map(Number);
        const newEvent=new events({event,category,subcategory,name,description,date,time,location,price: parsedPrice,seat,image})
        await newEvent.save()
        res.status(200).json(newEvent)
    } catch (error) {
        res.status(401).json(`Request failed: ${error}`)
    }

}

// get all events
exports.getEvents=async(req,res)=>{
    try {
        const result=await events.find()
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error)
    }
}
// get one events
exports.oneEvents=async(req,res)=>{
    try {
        const id=req.query.id;
        const result=await events.findById(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json(error)
    }
}

// get all sports events
exports.getSportsEvents = async (req, res) => {
    const searchKey = req.query.search;
    const query = {
        event: "sports",  // Filter by event type
        category: { $regex: searchKey, $options: "i" }  // Filter by category using regex for case-insensitive search
    };

    try {
        const result = await events.find(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json(error);
    }
};

// get all other events
exports.getOtherEvents=async(req,res)=>{
    const searchKey = req.query.search;
    const query = {
        event: "event",  // Filter by event type
        category: { $regex: searchKey, $options: "i" }  // Filter by category using regex for case-insensitive search
    };

    try {
        const result = await events.find(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json(error);
    }
}