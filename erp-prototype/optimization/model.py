import xgboost as xgb
import numpy as np

def predict_weight(features):
    model = xgb.Booster()
    model.load_model("dw_model.json")
    dmatrix = xgb.DMatrix(np.array([features]), feature_names=['L', 'W', 'H', 'DF'])
    return model.predict(dmatrix)[0]