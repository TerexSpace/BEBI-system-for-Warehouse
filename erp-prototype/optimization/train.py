from pathlib import Path

import pandas as pd
import xgboost as xgb


def main() -> None:
    """
    Train an XGBoost regressor for dimensional weight prediction and persist it
    next to this script for use by the Node.js backend.
    """
    base_dir = Path(__file__).resolve().parent
    data_path = base_dir.parent / "demo" / "synthetic_data.csv"
    model_path = base_dir / "dw_model.json"

    df = pd.read_csv(data_path)
    X = df[["L", "W", "H", "DF"]]
    y = df["optimal_weight"]

    dtrain = xgb.DMatrix(X, label=y, feature_names=["L", "W", "H", "DF"])
    params = {
        "objective": "reg:squarederror",
        "seed": 42,
    }
    model = xgb.train(params, dtrain, num_boost_round=50)
    model.save_model(str(model_path))


if __name__ == "__main__":
    main()
