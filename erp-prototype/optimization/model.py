from pathlib import Path

import numpy as np
import xgboost as xgb


def predict_weight(features):
    """
    Predict dimensional weight for a single feature vector using the trained
    model stored alongside this module.
    """
    model_path = Path(__file__).resolve().parent / "dw_model.json"

    model = xgb.Booster()
    model.load_model(str(model_path))

    dmatrix = xgb.DMatrix(
        np.array([features], dtype=float),
        feature_names=["L", "W", "H", "DF"],
    )
    return model.predict(dmatrix)[0]
