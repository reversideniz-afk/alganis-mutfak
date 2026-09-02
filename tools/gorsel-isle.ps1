# =============================================================================
# GÖRSEL İŞLEME  —  powershell -File tools/gorsel-isle.ps1
# -----------------------------------------------------------------------------
# gorseller/_ham/ klasöründeki ham görselleri uygulamanın kullandığı biçime
# çevirir:  ortadan 4:3 kırpar → 800x600'e küçültür → JPEG (kalite 78) yazar.
#
# Windows'un kendi .NET görüntü kütüphanesini kullanır; kurulum gerektirmez,
# npm bağımlılığı yoktur. "Bağımlılık yok" kuralı bozulmaz.
#
# Ham dosya adı tarif id'siyle aynı olmalı:  _ham/karniyarik.png
# Çıktı:                                      gorseller/karniyarik.jpg
#
# İşlenen ham dosyalar _ham/_bitti/ klasörüne taşınır; yanlışlıkla iki kez
# işlenmesin ve hangi görselin üretildiği kaybolmasın diye.
# =============================================================================

param(
  [int]$Genislik = 800,
  [int]$Yukseklik = 600,
  [int]$Kalite = 78
)

Add-Type -AssemblyName System.Drawing

$kok       = Split-Path -Parent $PSScriptRoot
$hamKlasor = Join-Path $kok "gorseller\_ham"
$cikti     = Join-Path $kok "gorseller"
$bitti     = Join-Path $hamKlasor "_bitti"

if (-not (Test-Path $hamKlasor)) {
  New-Item -ItemType Directory -Force $hamKlasor | Out-Null
  Write-Output "gorseller\_ham klasörü oluşturuldu. Ham görselleri buraya koy."
  exit 0
}
if (-not (Test-Path $cikti)) { New-Item -ItemType Directory -Force $cikti | Out-Null }
if (-not (Test-Path $bitti)) { New-Item -ItemType Directory -Force $bitti | Out-Null }

# --- JPEG kodlayıcı ve kalite ayarı -----------------------------------------
$kodlayici = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq "image/jpeg" }
$ayarlar = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ayarlar.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Kalite)

$dosyalar = Get-ChildItem -Path $hamKlasor -File |
            Where-Object { $_.Extension -match '^\.(png|jpg|jpeg|webp|bmp)$' }

if ($dosyalar.Count -eq 0) {
  Write-Output "gorseller\_ham içinde işlenecek görsel yok."
  exit 0
}

$sayac = 0
$hata  = 0

foreach ($dosya in $dosyalar) {
  $ad = [System.IO.Path]::GetFileNameWithoutExtension($dosya.Name)
  $hedef = Join-Path $cikti ($ad + ".jpg")

  try {
    $kaynak = [System.Drawing.Image]::FromFile($dosya.FullName)

    # --- ortadan 4:3 kırpma penceresini hesapla ---
    $oran = $Genislik / $Yukseklik
    $kOran = $kaynak.Width / $kaynak.Height

    if ($kOran -gt $oran) {
      # kaynak daha geniş → yanlardan kırp
      $kirpY = 0
      $kirpH = $kaynak.Height
      $kirpW = [int]([math]::Round($kaynak.Height * $oran))
      $kirpX = [int]([math]::Round(($kaynak.Width - $kirpW) / 2))
    } else {
      # kaynak daha uzun → üstten/alttan kırp
      $kirpX = 0
      $kirpW = $kaynak.Width
      $kirpH = [int]([math]::Round($kaynak.Width / $oran))
      $kirpY = [int]([math]::Round(($kaynak.Height - $kirpH) / 2))
    }

    $hedefBitmap = New-Object System.Drawing.Bitmap($Genislik, $Yukseklik)
    $hedefBitmap.SetResolution(72, 72)
    $cizim = [System.Drawing.Graphics]::FromImage($hedefBitmap)
    $cizim.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $cizim.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $cizim.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $cizim.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $kaynakDikdortgen = New-Object System.Drawing.Rectangle($kirpX, $kirpY, $kirpW, $kirpH)
    $hedefDikdortgen  = New-Object System.Drawing.Rectangle(0, 0, $Genislik, $Yukseklik)
    $cizim.DrawImage($kaynak, $hedefDikdortgen, $kaynakDikdortgen, [System.Drawing.GraphicsUnit]::Pixel)

    $hedefBitmap.Save($hedef, $kodlayici, $ayarlar)

    $cizim.Dispose()
    $hedefBitmap.Dispose()
    $kaynak.Dispose()

    $boyut = [math]::Round((Get-Item $hedef).Length / 1KB, 1)
    Write-Output ("  {0,-38} {1,7} KB" -f ($ad + ".jpg"), $boyut)

    Move-Item -Path $dosya.FullName -Destination (Join-Path $bitti $dosya.Name) -Force
    $sayac++
  }
  catch {
    Write-Output ("  HATA: {0} -> {1}" -f $dosya.Name, $_.Exception.Message)
    $hata++
  }
}

Write-Output ""
Write-Output ("İşlenen: {0}   Hata: {1}" -f $sayac, $hata)
Write-Output "Ham dosyalar gorseller\_ham\_bitti\ klasörüne taşındı."
Write-Output "Sırada: node tools/veri-kontrol.js"
