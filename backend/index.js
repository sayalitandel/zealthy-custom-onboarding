if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');

const sequelize = require('./config/databaseConfig');
const log = require('./utils/logUtil');

require('./models/User');
require('./models/UserAddress');
require('./models/FlowConfig');

const { ensureConfig } = require('./controllers/flowController');

const userFlowRoutes = require('./routes/userFlowRoutes');
const flowAdminRoutes = require('./routes/flowAdminRoutes');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:5173'], credentials: true }));
const allowed = process.env.FRONTEND_URL || 'http://localhost:5173'; 
app.use(cors({ origin: allowed }));        
// app.options('*', cors({ origin: allowed })); 
// app.options('(.*)', cors({ origin: allowed }));


app.use(bodyParser.json());

app.use((req, _res, next) => { log('request', { method: req.method, path: req.path }); next(); });

app.use('/api/user-flow', userFlowRoutes);
app.use('/api/flow-admin', flowAdminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (_req, res) => res.send('Custom Onboarding API is alive'));
app.get('/healthz', async (_req, res) => {
  try { await sequelize.authenticate(); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

sequelize.authenticate()
  .then(() => { log('db connected'); return sequelize.sync(); })   
  .then(() => ensureConfig())                                      
  .then(() => app.listen(PORT, () => log('server up', { port: PORT })))
  .catch(err => { log('db connection failed', { error: err.message }); process.exit(1); });

module.exports = app;
