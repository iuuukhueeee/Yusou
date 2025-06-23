import boto3

client = boto3.client("s3")

# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/put_bucket_lifecycle_configuration.html

BUCKET = ""

# response = client.put_bucket_lifecycle_configuration(
#     Bucket=BUCKET,
#     LifecycleConfiguration={
#         "Rules": [
#             {
#                 "Expiration": {
#                     "Date": datetime(2015, 1, 1),
#                     "Days": 123,
#                     "ExpiredObjectDeleteMarker": True | False,
#                 },
#                 "ID": "string",
#                 "Prefix": "string",
#                 "Filter": {
#                     "Prefix": "string",
#                     "Tag": {"Key": "string", "Value": "string"},
#                     "ObjectSizeGreaterThan": 123,
#                     "ObjectSizeLessThan": 123,
#                     "And": {
#                         "Prefix": "string",
#                         "Tags": [
#                             {"Key": "string", "Value": "string"},
#                         ],
#                         "ObjectSizeGreaterThan": 123,
#                         "ObjectSizeLessThan": 123,
#                     },
#                 },
#                 "Status": "Enabled" | "Disabled",
#                 "Transitions": [
#                     {
#                         "Date": datetime(2015, 1, 1),
#                         "Days": 123,
#                         "StorageClass": "GLACIER"
#                         | "STANDARD_IA"
#                         | "ONEZONE_IA"
#                         | "INTELLIGENT_TIERING"
#                         | "DEEP_ARCHIVE"
#                         | "GLACIER_IR",
#                     },
#                 ],
#                 "NoncurrentVersionTransitions": [
#                     {
#                         "NoncurrentDays": 123,
#                         "StorageClass": "GLACIER"
#                         | "STANDARD_IA"
#                         | "ONEZONE_IA"
#                         | "INTELLIGENT_TIERING"
#                         | "DEEP_ARCHIVE"
#                         | "GLACIER_IR",
#                         "NewerNoncurrentVersions": 123,
#                     },
#                 ],
#                 "NoncurrentVersionExpiration": {
#                     "NoncurrentDays": 123,
#                     "NewerNoncurrentVersions": 123,
#                 },
#             },
#         ]
#     },
# )

response = client.get_bucket_lifecycle_configuration(
    AccountId='',
    Bucket=''
)

print(response)
