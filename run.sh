#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

backend="backend"

usage() {
  cat <<EOF
Quản lý stack cosmetic-management-system

Cách dùng: ./run.sh <lệnh>

  build    Build lại 1 ảnh backend dùng chung (chạy khi sửa code backend)
  up       Khởi động toàn bộ stack lần đầu (build + start)
  start    build rồi restart tất cả service (lệnh thường dùng mỗi ngày)
  ps       Liệt kê trạng thái container
  logs     Xem log service (mặc định cả stack, có thể truyền tên service)
  down     Tắt toàn bộ stack
  clean    Xóa container/volume/ảnh dư của dự án này
EOF
}

cmd_build() {
  echo "==> Build 1 ảnh backend dùng chung..."
  docker compose build "$backend"
}

cmd_up() {
  echo "==> Build + khởi động toàn bộ stack..."
  cmd_build
  docker compose up -d --force-recreate
  echo "==> OK - gateway tại http://localhost:3000 (docs: /api/docs)"
}

cmd_start() {
  cmd_build
  echo "==> Restart toàn bộ service..."
  docker compose up -d --force-recreate
}

cmd_ps() {
  docker compose ps
}

cmd_logs() {
  docker compose logs --tail=100 -f "$@"
}

cmd_down() {
  docker compose down
}

cmd_clean() {
  docker compose down --volumes --rmi all
  echo "==> Đã xóa container, volume và ảnh của dự án."
}

if [ $# -eq 0 ]; then
  usage
  exit 1
fi

case "$1" in
  build) shift; cmd_build ;;
  up)    shift; cmd_up ;;
  start) shift; cmd_start ;;
  ps)    shift; cmd_ps ;;
  logs)  shift; cmd_logs "$@" ;;
  down)  shift; cmd_down ;;
  clean) shift; cmd_clean ;;
  *) usage; exit 1 ;;
esac