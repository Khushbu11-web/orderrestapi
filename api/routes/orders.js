const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



const Order = require('../models/order');
//get all orders
router.get('/', (req, res, next) => {

    Order.find().exec()
        .then(docs => {
            console.log(docs);
            if (docs.length >= 0) {
                res.status(200).json(docs);
            }

        }).catch(err => {

            console.log(err);
            res.status(404).json({
                message: 'No Orders Found'
            });
        });

});

//create order
router.post('/', (req, res, next) => {

    const order = new Order({

        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        quantity: req.body.quantity
    });
    order.save().then(result => {


        console.log(result);
        res.status(201).json({

            message: "Handling POST requets to /orders",
            createOrder: result
        }).catch(err => {

            console.log(err);
            res.status(500).json({ error: err });

        });

    });
    //get order by ID
    router.get('/:orderId', (req, res, next) => {

        const id = req.params.orderId;
        Order.findById(id)
            .exec()
            .then(docs => {

                console.log("from databse", docs);
                if (docs) {
                    res.status(200).json(docs)

                } else {

                    res.status(404).json({ message: ' No valid entry found' })
                }

            }).catch(err => {

                console.log(err);
                res.status(500).json({ error: err });

            })

    });

});
router.patch('/:orderId', (req, res, next) => {

    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body) {

        updateOps[ops.propQuantity] = ops.value;
    }
    Order.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {

            res.status(200).json(result);
        }).catch(err => {

            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});
router.delete('/:orderId', (req, res, next) => {

    const id = req.params.orderId;
    Order.remove({ _id: id }).exec()
        .then(result => {

            res.status(200).json(result);
        }).catch(err => {

            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});
module.exports = router;