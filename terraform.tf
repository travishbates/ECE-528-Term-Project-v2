resource "google_project" "f2023_ece528_bates_travis" {
  auto_create_network = true
  billing_account     = "0152E9-E9E80C-CD3AE3"
  folder_id           = "635890743054"
  labels = {
    firebase = "enabled"
  }
  name       = "ECE 528 Gains Tracker"
  project_id = "f2023-ece528-bates-travis"
}

terraform {
  backend "gcs" {
    bucket = "f2023-ece528-bates-travis-tfstate"
    prefix = "env/dev"
  }
}

resource "google_sql_database_instance" "database" {
  database_version = "POSTGRES_15"
  name             = "database"
  project          = "f2023-ece528-bates-travis"
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

resource "google_storage_bucket" "chatbot_artifacts" {
  force_destroy               = false
  location                    = "US"
  name                        = "f2023-ece528-bates-travis-chatbot-artifacts"
  project                     = "f2023-ece528-bates-travis"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket" "user_reports" {
  force_destroy               = false
  location                    = "US"
  name                        = "f2023-ece528-bates-travis-user-reports"
  project                     = "f2023-ece528-bates-travis"
  public_access_prevention    = "enforced"
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
}