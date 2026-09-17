# PROBLEMS
# Buyers in Sri Lanka face high agricultural price uncertainty.

#OBJECTIVES
# Predict retail food prices in LKR.
# Predict top lowest-pricing markets to help buyers buy cheaper.

# ML PROBLEM TYPE
# Since price is numeric value, this is regression problem.

# Dataset
# source - https://data.humdata.org/dataset/wfp-food-prices-for-sri-lanka/resource/3638f0d6-9969-48cf-a919-1d879d037ec6

# number of records - 34262
# number of features - 16
# target variable - price

# feature description - date, admin1, admin2, market, market_id, latitude, longitude, category, commodity, commodity_id, unit, priceflag, pricetype, currency, price, usdprice

# data types - date, admin1, admin2, market, category, commodity, unit, priceflag, pricetype, currency are String. market_id, commodity_id are integer. latitude, longitude, price, usdprice are float.

# missing values -194
# duplicate records - 0
# data quality issues - missing values, very low wholesale records, Irrelevant Features







# import libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# Load the dataset
df = pd.read_csv('data/wfp_food_prices_lka.csv')

# DATA UNDERSTANDING - EDA

# print("--first 5 rows of the dataset--")
# print(df.head())

# print("--row and column count--")
# print(df.shape)

# print("--data types and null values--")
# print(df.info())

# print("--null values in each column--")
# print(df.isnull().sum())

# print("--duplicate rows count--")
# print(df.duplicated().sum())

# print("--summary statistics for numerical columns--")
# print(df.describe())

# print("--unique values in categorical columns--")
# print(df[['market', 'commodity', 'category', 'pricetype']].nunique())

# DATA CLEANING

# drop null values
df = df.dropna()
# print(df.isnull().sum())

# drop duplicates
df = df.drop_duplicates()
# print(df.duplicated().sum())

# filter only include retail prices for the prediction task
df = df[df['pricetype'] == 'Retail']

# Extract 'year' and 'month' from the raw date string to support prediction
df['date'] = pd.to_datetime(df['date'])
df['year'] = pd.to_datetime(df['date']).dt.year
df['month'] = pd.to_datetime(df['date']).dt.month

# Removing Irrelevant Features
features_to_drop = [
    'usdprice', 'currency', 'priceflag', 'market_id', 
    'commodity_id', 'unit', 'admin1', 'admin2', 
    'latitude', 'longitude', 'date', 'category', 'pricetype' 
]
df = df.drop(columns=features_to_drop, errors='ignore')
# print("\nRemaining Features for Training:", df.columns.tolist())
# print(df.head())

# PREPROCESSING & PIPELINE SETUP

# Define Target - y and Features - X
X = df.drop(columns=['price'])
y = df['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define column types for transformation
categorical_cols = ['market', 'commodity']
numeric_cols = ['year', 'month']

# Build the preprocessor to automatically handle encoding and scaling
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols), 
        ('num', StandardScaler(), numeric_cols)                            
    ]
)


# MODEL TRAINING AND EVALUATION

# create the complete pipeline bundling the preprocessor and the model together
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
])

# train the model using the training data
pipeline.fit(X_train, y_train)

# test the model using testing data
y_pred = pipeline.predict(X_test)

# calculate R2 and MAE
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

# print(r2)
# print(mae)

# EXPORT

# save as a .pkl file for the backend
joblib.dump(pipeline, 'data/crop_price_model.pkl')