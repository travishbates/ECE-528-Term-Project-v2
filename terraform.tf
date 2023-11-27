resource "google_project" "f2023_ece528_group7" {
  auto_create_network = true
  billing_account     = "0152E9-E9E80C-CD3AE3"
  folder_id           = "635890743054"
  labels = {
    firebase = "enabled"
  }
  name       = "ECE 528 Gains Tracker"
  project_id = "f2023-ece528-group7"
}
# terraform import google_project.f2023_ece528_group7 projects/f2023-ece528-group7
resource "google_sql_database_instance" "database" {
  database_version = "POSTGRES_15"
  name             = "database"
  project          = "f2023-ece528-group7"
  region           = "us-east1"
  settings {
    activation_policy = "ALWAYS"
    availability_type = "ZONAL"
    backup_configuration {
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
      enabled                        = true
      location                       = "us"
      start_time                     = "19:00"
      transaction_log_retention_days = 7
    }
    disk_autoresize       = true
    disk_autoresize_limit = 0
    disk_size             = 10
    disk_type             = "PD_SSD"
    insights_config {
      query_string_length = 0
    }
    ip_configuration {
      authorized_networks {
        name  = "68.179.140.8"
        value = "68.179.140.8"
      }
      ipv4_enabled = true
    }
    location_preference {
      zone = "us-east1-d"
    }
    pricing_plan = "PER_USE"
    tier         = "db-f1-micro"
  }
}
# terraform import google_sql_database_instance.database projects/f2023-ece528-group7/instances/database
resource "google_compute_firewall" "default_allow_icmp" {
  allow {
    protocol = "icmp"
  }
  description   = "Allow ICMP from anywhere"
  direction     = "INGRESS"
  name          = "default-allow-icmp"
  network       = "https://www.googleapis.com/compute/v1/projects/f2023-ece528-group7/global/networks/default"
  priority      = 65534
  project       = "f2023-ece528-group7"
  source_ranges = ["0.0.0.0/0"]
}
# terraform import google_compute_firewall.default_allow_icmp projects/f2023-ece528-group7/global/firewalls/default-allow-icmp
resource "google_compute_firewall" "default_allow_internal" {
  allow {
    ports    = ["0-65535"]
    protocol = "tcp"
  }
  allow {
    ports    = ["0-65535"]
    protocol = "udp"
  }
  allow {
    protocol = "icmp"
  }
  description   = "Allow internal traffic on the default network"
  direction     = "INGRESS"
  name          = "default-allow-internal"
  network       = "https://www.googleapis.com/compute/v1/projects/f2023-ece528-group7/global/networks/default"
  priority      = 65534
  project       = "f2023-ece528-group7"
  source_ranges = ["10.128.0.0/9"]
}
# terraform import google_compute_firewall.default_allow_internal projects/f2023-ece528-group7/global/firewalls/default-allow-internal
resource "google_compute_firewall" "default_allow_rdp" {
  allow {
    ports    = ["3389"]
    protocol = "tcp"
  }
  description   = "Allow RDP from anywhere"
  direction     = "INGRESS"
  name          = "default-allow-rdp"
  network       = "https://www.googleapis.com/compute/v1/projects/f2023-ece528-group7/global/networks/default"
  priority      = 65534
  project       = "f2023-ece528-group7"
  source_ranges = ["0.0.0.0/0"]
}
# terraform import google_compute_firewall.default_allow_rdp projects/f2023-ece528-group7/global/firewalls/default-allow-rdp
resource "google_compute_firewall" "default_allow_ssh" {
  allow {
    ports    = ["22"]
    protocol = "tcp"
  }
  description   = "Allow SSH from anywhere"
  direction     = "INGRESS"
  name          = "default-allow-ssh"
  network       = "https://www.googleapis.com/compute/v1/projects/f2023-ece528-group7/global/networks/default"
  priority      = 65534
  project       = "f2023-ece528-group7"
  source_ranges = ["0.0.0.0/0"]
}
# terraform import google_compute_firewall.default_allow_ssh projects/f2023-ece528-group7/global/firewalls/default-allow-ssh
resource "google_service_account" "firebase_adminsdk_rhaxt" {
  account_id   = "firebase-adminsdk-rhaxt"
  description  = "Firebase Admin SDK Service Agent"
  display_name = "firebase-adminsdk"
  project      = "f2023-ece528-group7"
}
# terraform import google_service_account.firebase_adminsdk_rhaxt projects/f2023-ece528-group7/serviceAccounts/firebase-adminsdk-rhaxt@f2023-ece528-group7.iam.gserviceaccount.com
resource "google_service_account" "690748867508_compute" {
  account_id   = "690748867508-compute"
  display_name = "Compute Engine default service account"
  project      = "f2023-ece528-group7"
}
# terraform import google_service_account.690748867508_compute projects/f2023-ece528-group7/serviceAccounts/690748867508-compute@f2023-ece528-group7.iam.gserviceaccount.com
resource "google_service_account" "f2023_ece528_group7" {
  account_id   = "f2023-ece528-group7"
  display_name = "App Engine default service account"
  project      = "f2023-ece528-group7"
}
# terraform import google_service_account.f2023_ece528_group7 projects/f2023-ece528-group7/serviceAccounts/f2023-ece528-group7@f2023-ece528-group7.iam.gserviceaccount.com
resource "google_logging_log_sink" "a_default" {
  destination            = "logging.googleapis.com/projects/f2023-ece528-group7/locations/global/buckets/_Default"
  filter                 = "NOT LOG_ID(\"cloudaudit.googleapis.com/activity\") AND NOT LOG_ID(\"externalaudit.googleapis.com/activity\") AND NOT LOG_ID(\"cloudaudit.googleapis.com/system_event\") AND NOT LOG_ID(\"externalaudit.googleapis.com/system_event\") AND NOT LOG_ID(\"cloudaudit.googleapis.com/access_transparency\") AND NOT LOG_ID(\"externalaudit.googleapis.com/access_transparency\")"
  name                   = "_Default"
  project                = "690748867508"
  unique_writer_identity = true
}
# terraform import google_logging_log_sink.a_default 690748867508###_Default
resource "google_logging_log_sink" "a_required" {
  destination            = "logging.googleapis.com/projects/f2023-ece528-group7/locations/global/buckets/_Required"
  filter                 = "LOG_ID(\"cloudaudit.googleapis.com/activity\") OR LOG_ID(\"externalaudit.googleapis.com/activity\") OR LOG_ID(\"cloudaudit.googleapis.com/system_event\") OR LOG_ID(\"externalaudit.googleapis.com/system_event\") OR LOG_ID(\"cloudaudit.googleapis.com/access_transparency\") OR LOG_ID(\"externalaudit.googleapis.com/access_transparency\")"
  name                   = "_Required"
  project                = "690748867508"
  unique_writer_identity = true
}
# terraform import google_logging_log_sink.a_required 690748867508###_Required
resource "google_secret_manager_secret" "database_password" {
  project = "690748867508"
  replication {
    automatic = true
  }
  secret_id = "DATABASE_PASSWORD"
}
# terraform import google_secret_manager_secret.database_password projects/690748867508/secrets/DATABASE_PASSWORD
resource "google_secret_manager_secret_version" "projects_690748867508_secrets_database_password_versions_1" {
  enabled     = true
  secret      = "projects/690748867508/secrets/DATABASE_PASSWORD"
  secret_data = "INSERT_SECRET_HERE"
}
# terraform import google_secret_manager_secret_version.projects_690748867508_secrets_database_password_versions_1 projects/690748867508/secrets/DATABASE_PASSWORD/versions/1
resource "google_project_service" "aiplatform_googleapis_com" {
  project = "690748867508"
  service = "aiplatform.googleapis.com"
}
# terraform import google_project_service.aiplatform_googleapis_com 690748867508/aiplatform.googleapis.com
resource "google_project_service" "appengine_googleapis_com" {
  project = "690748867508"
  service = "appengine.googleapis.com"
}
# terraform import google_project_service.appengine_googleapis_com 690748867508/appengine.googleapis.com
resource "google_project_service" "appenginereporting_googleapis_com" {
  project = "690748867508"
  service = "appenginereporting.googleapis.com"
}
# terraform import google_project_service.appenginereporting_googleapis_com 690748867508/appenginereporting.googleapis.com
resource "google_project_service" "artifactregistry_googleapis_com" {
  project = "690748867508"
  service = "artifactregistry.googleapis.com"
}
# terraform import google_project_service.artifactregistry_googleapis_com 690748867508/artifactregistry.googleapis.com
resource "google_project_service" "bigquery_googleapis_com" {
  project = "690748867508"
  service = "bigquery.googleapis.com"
}
# terraform import google_project_service.bigquery_googleapis_com 690748867508/bigquery.googleapis.com
resource "google_project_service" "bigquerymigration_googleapis_com" {
  project = "690748867508"
  service = "bigquerymigration.googleapis.com"
}
# terraform import google_project_service.bigquerymigration_googleapis_com 690748867508/bigquerymigration.googleapis.com
resource "google_project_service" "bigquerystorage_googleapis_com" {
  project = "690748867508"
  service = "bigquerystorage.googleapis.com"
}
# terraform import google_project_service.bigquerystorage_googleapis_com 690748867508/bigquerystorage.googleapis.com
resource "google_project_service" "cloudapis_googleapis_com" {
  project = "690748867508"
  service = "cloudapis.googleapis.com"
}
# terraform import google_project_service.cloudapis_googleapis_com 690748867508/cloudapis.googleapis.com
resource "google_project_service" "cloudbuild_googleapis_com" {
  project = "690748867508"
  service = "cloudbuild.googleapis.com"
}
# terraform import google_project_service.cloudbuild_googleapis_com 690748867508/cloudbuild.googleapis.com
resource "google_project_service" "cloudresourcemanager_googleapis_com" {
  project = "690748867508"
  service = "cloudresourcemanager.googleapis.com"
}
# terraform import google_project_service.cloudresourcemanager_googleapis_com 690748867508/cloudresourcemanager.googleapis.com
resource "google_project_service" "cloudtrace_googleapis_com" {
  project = "690748867508"
  service = "cloudtrace.googleapis.com"
}
# terraform import google_project_service.cloudtrace_googleapis_com 690748867508/cloudtrace.googleapis.com
resource "google_project_service" "compute_googleapis_com" {
  project = "690748867508"
  service = "compute.googleapis.com"
}
# terraform import google_project_service.compute_googleapis_com 690748867508/compute.googleapis.com
resource "google_project_service" "containerregistry_googleapis_com" {
  project = "690748867508"
  service = "containerregistry.googleapis.com"
}
# terraform import google_project_service.containerregistry_googleapis_com 690748867508/containerregistry.googleapis.com
resource "google_project_service" "dataflow_googleapis_com" {
  project = "690748867508"
  service = "dataflow.googleapis.com"
}
# terraform import google_project_service.dataflow_googleapis_com 690748867508/dataflow.googleapis.com
resource "google_project_service" "dataform_googleapis_com" {
  project = "690748867508"
  service = "dataform.googleapis.com"
}
# terraform import google_project_service.dataform_googleapis_com 690748867508/dataform.googleapis.com
resource "google_project_service" "datastore_googleapis_com" {
  project = "690748867508"
  service = "datastore.googleapis.com"
}
# terraform import google_project_service.datastore_googleapis_com 690748867508/datastore.googleapis.com
resource "google_project_service" "deploymentmanager_googleapis_com" {
  project = "690748867508"
  service = "deploymentmanager.googleapis.com"
}
# terraform import google_project_service.deploymentmanager_googleapis_com 690748867508/deploymentmanager.googleapis.com
resource "google_project_service" "dialogflow_googleapis_com" {
  project = "690748867508"
  service = "dialogflow.googleapis.com"
}
# terraform import google_project_service.dialogflow_googleapis_com 690748867508/dialogflow.googleapis.com
resource "google_project_service" "discoveryengine_googleapis_com" {
  project = "690748867508"
  service = "discoveryengine.googleapis.com"
}
# terraform import google_project_service.discoveryengine_googleapis_com 690748867508/discoveryengine.googleapis.com
resource "google_project_service" "fcm_googleapis_com" {
  project = "690748867508"
  service = "fcm.googleapis.com"
}
# terraform import google_project_service.fcm_googleapis_com 690748867508/fcm.googleapis.com
resource "google_project_service" "firebasedynamiclinks_googleapis_com" {
  project = "690748867508"
  service = "firebasedynamiclinks.googleapis.com"
}
# terraform import google_project_service.firebasedynamiclinks_googleapis_com 690748867508/firebasedynamiclinks.googleapis.com
resource "google_project_service" "firebaseinstallations_googleapis_com" {
  project = "690748867508"
  service = "firebaseinstallations.googleapis.com"
}
# terraform import google_project_service.firebaseinstallations_googleapis_com 690748867508/firebaseinstallations.googleapis.com
resource "google_project_service" "firebasehosting_googleapis_com" {
  project = "690748867508"
  service = "firebasehosting.googleapis.com"
}
# terraform import google_project_service.firebasehosting_googleapis_com 690748867508/firebasehosting.googleapis.com
resource "google_project_service" "logging_googleapis_com" {
  project = "690748867508"
  service = "logging.googleapis.com"
}
# terraform import google_project_service.logging_googleapis_com 690748867508/logging.googleapis.com
resource "google_project_service" "firebaseremoteconfig_googleapis_com" {
  project = "690748867508"
  service = "firebaseremoteconfig.googleapis.com"
}
# terraform import google_project_service.firebaseremoteconfig_googleapis_com 690748867508/firebaseremoteconfig.googleapis.com
resource "google_project_service" "firebaseremoteconfigrealtime_googleapis_com" {
  project = "690748867508"
  service = "firebaseremoteconfigrealtime.googleapis.com"
}
# terraform import google_project_service.firebaseremoteconfigrealtime_googleapis_com 690748867508/firebaseremoteconfigrealtime.googleapis.com
resource "google_project_service" "oslogin_googleapis_com" {
  project = "690748867508"
  service = "oslogin.googleapis.com"
}
# terraform import google_project_service.oslogin_googleapis_com 690748867508/oslogin.googleapis.com
resource "google_project_service" "monitoring_googleapis_com" {
  project = "690748867508"
  service = "monitoring.googleapis.com"
}
# terraform import google_project_service.monitoring_googleapis_com 690748867508/monitoring.googleapis.com
resource "google_project_service" "runtimeconfig_googleapis_com" {
  project = "690748867508"
  service = "runtimeconfig.googleapis.com"
}
# terraform import google_project_service.runtimeconfig_googleapis_com 690748867508/runtimeconfig.googleapis.com
resource "google_project_service" "pubsub_googleapis_com" {
  project = "690748867508"
  service = "pubsub.googleapis.com"
}
# terraform import google_project_service.pubsub_googleapis_com 690748867508/pubsub.googleapis.com
resource "google_project_service" "securetoken_googleapis_com" {
  project = "690748867508"
  service = "securetoken.googleapis.com"
}
# terraform import google_project_service.securetoken_googleapis_com 690748867508/securetoken.googleapis.com
resource "google_project_service" "iam_googleapis_com" {
  project = "690748867508"
  service = "iam.googleapis.com"
}
# terraform import google_project_service.iam_googleapis_com 690748867508/iam.googleapis.com
resource "google_project_service" "servicemanagement_googleapis_com" {
  project = "690748867508"
  service = "servicemanagement.googleapis.com"
}
# terraform import google_project_service.servicemanagement_googleapis_com 690748867508/servicemanagement.googleapis.com
resource "google_project_service" "notebooks_googleapis_com" {
  project = "690748867508"
  service = "notebooks.googleapis.com"
}
# terraform import google_project_service.notebooks_googleapis_com 690748867508/notebooks.googleapis.com
resource "google_project_service" "serviceusage_googleapis_com" {
  project = "690748867508"
  service = "serviceusage.googleapis.com"
}
# terraform import google_project_service.serviceusage_googleapis_com 690748867508/serviceusage.googleapis.com
resource "google_project_service" "iamcredentials_googleapis_com" {
  project = "690748867508"
  service = "iamcredentials.googleapis.com"
}
# terraform import google_project_service.iamcredentials_googleapis_com 690748867508/iamcredentials.googleapis.com
resource "google_project_service" "identitytoolkit_googleapis_com" {
  project = "690748867508"
  service = "identitytoolkit.googleapis.com"
}
# terraform import google_project_service.identitytoolkit_googleapis_com 690748867508/identitytoolkit.googleapis.com
resource "google_project_service" "visionai_googleapis_com" {
  project = "690748867508"
  service = "visionai.googleapis.com"
}
# terraform import google_project_service.visionai_googleapis_com 690748867508/visionai.googleapis.com
resource "google_project_service" "testing_googleapis_com" {
  project = "690748867508"
  service = "testing.googleapis.com"
}
# terraform import google_project_service.testing_googleapis_com 690748867508/testing.googleapis.com
resource "google_storage_bucket" "chatbot_artifacts" {
  force_destroy               = false
  location                    = "US"
  name                        = "chatbot-artifacts"
  project                     = "f2023-ece528-group7"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}
# terraform import google_storage_bucket.chatbot_artifacts chatbot-artifacts
resource "google_storage_bucket" "690748867508_us_import_custom" {
  force_destroy = false
  labels = {
    goog-drz-discoveryengine-pcr-location = "us"
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age        = 3
      with_state = "ANY"
    }
  }
  location                 = "US"
  name                     = "690748867508_us_import_custom"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.690748867508_us_import_custom 690748867508_us_import_custom
resource "google_project_service" "sqladmin_googleapis_com" {
  project = "690748867508"
  service = "sqladmin.googleapis.com"
}
# terraform import google_project_service.sqladmin_googleapis_com 690748867508/sqladmin.googleapis.com
resource "google_storage_bucket" "690748867508_us_import_content" {
  force_destroy = false
  labels = {
    goog-drz-discoveryengine-pcr-location = "us"
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age        = 3
      with_state = "ANY"
    }
  }
  location                 = "US"
  name                     = "690748867508_us_import_content"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.690748867508_us_import_content 690748867508_us_import_content
resource "google_project_service" "sql_component_googleapis_com" {
  project = "690748867508"
  service = "sql-component.googleapis.com"
}
# terraform import google_project_service.sql_component_googleapis_com 690748867508/sql-component.googleapis.com
resource "google_storage_bucket" "reports_528" {
  force_destroy               = false
  location                    = "US"
  name                        = "reports-528"
  project                     = "f2023-ece528-group7"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}
# terraform import google_storage_bucket.reports_528 reports-528
resource "google_storage_bucket" "cloud_ai_platform_ff4bb3b4_9b2d_4c7a_9baa_7859494cff66" {
  cors {
    max_age_seconds = 3600
    method          = ["GET", "HEAD", "POST", "PUT"]
    origin          = ["https://*.cloud.google.com", "https://*.firebase.google.com", "https://*.corp.google.com", "https://*.crowdsource.google.com", "https://*.datacompute.google.com", "https://datacompute.google.com"]
    response_header = ["Content-Type, Range", "Content-Type", "Access-Control-Allow-Origin"]
  }
  force_destroy = false
  labels = {
    goog-vertex-ai = ""
  }
  location                 = "US-CENTRAL1"
  name                     = "cloud-ai-platform-ff4bb3b4-9b2d-4c7a-9baa-7859494cff66"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "REGIONAL"
}
# terraform import google_storage_bucket.cloud_ai_platform_ff4bb3b4_9b2d_4c7a_9baa_7859494cff66 cloud-ai-platform-ff4bb3b4-9b2d-4c7a-9baa-7859494cff66
resource "google_project_service" "storage_api_googleapis_com" {
  project = "690748867508"
  service = "storage-api.googleapis.com"
}
# terraform import google_project_service.storage_api_googleapis_com 690748867508/storage-api.googleapis.com
resource "google_storage_bucket" "f2023_ece528_group7_appspot_com" {
  force_destroy            = false
  location                 = "US-EAST1"
  name                     = "f2023-ece528-group7.appspot.com"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.f2023_ece528_group7_appspot_com f2023-ece528-group7.appspot.com
resource "google_storage_bucket" "sc_dataset" {
  force_destroy               = false
  location                    = "US"
  name                        = "sc-dataset"
  project                     = "f2023-ece528-group7"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}
# terraform import google_storage_bucket.sc_dataset sc-dataset
resource "google_project_service" "firebase_googleapis_com" {
  project = "690748867508"
  service = "firebase.googleapis.com"
}
# terraform import google_project_service.firebase_googleapis_com 690748867508/firebase.googleapis.com
resource "google_project_service" "storage_googleapis_com" {
  project = "690748867508"
  service = "storage.googleapis.com"
}
# terraform import google_project_service.storage_googleapis_com 690748867508/storage.googleapis.com
resource "google_storage_bucket" "vertexai_textclassification" {
  force_destroy               = false
  location                    = "US-CENTRAL1"
  name                        = "vertexai-textclassification"
  project                     = "f2023-ece528-group7"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}
# terraform import google_storage_bucket.vertexai_textclassification vertexai-textclassification
resource "google_project_service" "firebaserules_googleapis_com" {
  project = "690748867508"
  service = "firebaserules.googleapis.com"
}
# terraform import google_project_service.firebaserules_googleapis_com 690748867508/firebaserules.googleapis.com
resource "google_storage_bucket" "690748867508_us_import_csv" {
  force_destroy = false
  labels = {
    goog-drz-discoveryengine-pcr-location = "us"
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age        = 3
      with_state = "ANY"
    }
  }
  location                 = "US"
  name                     = "690748867508_us_import_csv"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.690748867508_us_import_csv 690748867508_us_import_csv
resource "google_storage_bucket" "us_artifacts_f2023_ece528_group7_appspot_com" {
  force_destroy            = false
  location                 = "US"
  name                     = "us.artifacts.f2023-ece528-group7.appspot.com"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.us_artifacts_f2023_ece528_group7_appspot_com us.artifacts.f2023-ece528-group7.appspot.com
resource "google_project_service" "secretmanager_googleapis_com" {
  project = "690748867508"
  service = "secretmanager.googleapis.com"
}
# terraform import google_project_service.secretmanager_googleapis_com 690748867508/secretmanager.googleapis.com
resource "google_storage_bucket" "staging_f2023_ece528_group7_appspot_com" {
  force_destroy = false
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age        = 15
      with_state = "ANY"
    }
  }
  location                 = "US-EAST1"
  name                     = "staging.f2023-ece528-group7.appspot.com"
  project                  = "f2023-ece528-group7"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.staging_f2023_ece528_group7_appspot_com staging.f2023-ece528-group7.appspot.com
resource "google_project_service" "storage_component_googleapis_com" {
  project = "690748867508"
  service = "storage-component.googleapis.com"
}
# terraform import google_project_service.storage_component_googleapis_com 690748867508/storage-component.googleapis.com