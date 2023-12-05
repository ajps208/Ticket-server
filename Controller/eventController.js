const events=require('../Model/eventSchema')

// add events
exports.addEvents=async(req,res)=>{
    console.log("inside the event add");
    console.log(req.body);
    // const userId=req.payload
    const image=req.file.filename
    const{event,category,subcategory,name,description,date,time,location,price,seat,qty}=req.body
    console.log(req.header);
    console.log(event,category,subcategory,name,description,date,time,location,price,seat);
    console.log(image);
    try {
       
        const parsedPrice = price.split(',').map(Number);
        const parsedSeat = seat.split(',')
        const parsedQty = qty.split(',').map(Number);

        const newEvent=new events({event,category,subcategory,name,description,date,time,location,price: parsedPrice,seat:parsedSeat,image,qty:parsedQty})
        await newEvent.save()
        console.log(newEvent);
        res.status(200).json(newEvent)
    } catch (error) {
        console.log(error);
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
        category: { $regex: searchKey, $options: "i" } 
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

// edit events
exports.editEvents = async (req, res) => {
    console.log("inside the edit event");
    const userId = req.payload;
    const {ticket,ticketQty } = req.body;
    // console.log(ticketQty);
    const{_id,event,category,subcategory,name,description,date,time,location,price,seat,image,qty} =ticket
    // console.log(qty);
    try {
      const result = await events.findByIdAndUpdate({_id:_id},{event,category,subcategory,name,description,date,time,location,price,seat,image,qty:ticketQty},
        { new: true });
        await result.save()
        // console.log("updated ",result);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
//   delete event
exports.deleteEvent=async(req,res)=>{
    console.log('inside the delete');
    const {eventid}=req.params
    console.log(eventid);
    try {
        const result=await events.findByIdAndDelete({_id:eventid})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }

}

// get event by specificsearch
exports.getSearchEvents = async (req, res) => {
    console.log("inside specificsearch ");
    const searchKey = req.query.search;
    console.log(searchKey);
    const regexPattern = new RegExp(searchKey, 'i');


    try {
        const result = await events.find({
            $or: [
              { event: { $regex: regexPattern } },
              { category: { $regex: regexPattern } },
              { subcategory: { $regex: regexPattern } },
              { name: { $regex: regexPattern } },
              { description: { $regex: regexPattern } },
              { date: { $regex: regexPattern } },
              { time: { $regex: regexPattern } },
              { location: { $regex: regexPattern } },
            
            ],
          })
          console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
};