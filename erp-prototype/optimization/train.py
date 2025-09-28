import xgboost as xgb
import pandas as pd

df = pd.read_csv("demo/synthetic_data.csv")
X = df[['L','W','H','DF']]
y = df['optimal_weight']

dtrain = xgb.DMatrix(X, label=y)
params = {"objective":"reg:squarederror"}
model = xgb.train(params, dtrain, num_boost_round=50)
model.save_model("dw_model.json")