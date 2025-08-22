const express = require('express');
const authRoutes= require('./routes/user.route');
const assetRoutes = require('./routes/asset.route');
const transferRoutes = require('./routes/transfer.route');
const purchaseRoutes = require('./routes/purchase.route');
const assignmentRoutes = require('./routes/assignment.routh'); 
const expenditureRoutes = require('./routes/expenditure.route');
const app= express();

app.use('/user', authRoutes);
app.use('/asset', assetRoutes);
app.use('/transfer', transferRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/assignment', assignmentRoutes);
app.use('/expenditure', expenditureRoutes);

module.exports = app;

