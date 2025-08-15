<?php

namespace App\Exports;

use App\Models\Trade;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class TradeExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithEvents, WithColumnFormatting
{
    protected $journal;
    private $totalPL = 0;

    public function __construct($journal)
    {
        $this->journal = $journal;
    }

    public function query()
    {
        return Trade::query()
            ->where('journal_id', $this->journal->id)
            ->select([
                'id',
                'pair',
                'direction',
                'volume',
                'price_open',
                'price_close',
                'profit_loss',
                'risk_reward',
                'opened_at',
            ]);
    }

    public function headings(): array
    {
        return [
            "No",
            "Pair",
            "Direction",
            "Volume",
            "Open",
            "Close",
            "P/L",
            "RR",
            "Date",
        ];
    }

    public function map($trade): array
    {
        static $index = 1;

        $this->totalPL += $trade->profit_loss;

        return [
            $index++,
            strtoupper($trade->pair),
            strtoupper($trade->direction),
            $trade->volume,
            $trade->price_open,
            $trade->price_close,
            $trade->profit_loss,
            $trade->risk_reward,
            $trade->opened_at,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'E' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'F' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'G' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'H' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4CAF50']],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();

                // Auto filter
                $sheet->setAutoFilter('A1:I' . $highestRow);

                // Freeze pane
                $sheet->freezePane('A2');

                // Auto size columns
                foreach (range('A', 'I') as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }

                // Total row
                $totalRow = $highestRow + 2;
                $sheet->setCellValue("A{$totalRow}", "TOTAL:");
                $sheet->mergeCells("A{$totalRow}:F{$totalRow}");
                $sheet->setCellValue("G{$totalRow}", $this->totalPL);

                $sheet->getStyle("A{$totalRow}:G{$totalRow}")->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'FFFF99'],
                    ],
                ]);

                // Warna merah jika P/L negatif
                for ($row = 2; $row <= $highestRow; $row++) {
                    $pl = $sheet->getCell("G{$row}")->getValue();
                    if ($pl < 0) {
                        $sheet->getStyle("A{$row}:I{$row}")->applyFromArray([
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => ['rgb' => 'FFE6E6'],
                            ],
                            'font' => ['color' => ['rgb' => 'B71C1C']],
                        ]);
                    }
                }
            },
        ];
    }
}
